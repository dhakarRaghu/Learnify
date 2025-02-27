import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is set
// if (!process.env.GEMINI_API_KEY) {
//   console.error("GEMINI_API_KEY " , process.env.GEMINI_API_KEY );
//   throw new Error("GOOGLE_AI_API_KEY is not set in environment variables");
// }

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
console.error("GEMINI_API_KEY " , process.env.GEMINI_API_KEY as string , typeof process.env.GEMINI_API_KEY);
interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

/**
 * Strict output function to interact with Gemini API.
 * @param system_prompt - The system prompt to guide the model's behavior.
 * @param user_prompt - The user-provided input prompt or an array of prompts.
 * @param output_format - The desired output format as a JSON structure.
 * @param default_category - Default value for unrecognized output fields (optional).
 * @param output_value_only - If true, extracts only the values of the output JSON.øø
 * @param modelName - The name of the model to use.
 * @param temperature - The temperature for model responses (controls randomness).
 * @param num_tries - Number of retry attempts in case of errors.
 * @param verbose - Whether to log additional debugging information.
 * @returns A structured output from Gemini API based on the provided format.
 */
export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  modelName: string = "gemini-1.5-flash",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
): Promise<any> {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // Utility for delay

  try {
    const model = genAI.getGenerativeModel({ model: modelName });

    const list_input = Array.isArray(user_prompt); // Check if user input is a list
    const dynamic_elements = /<.*?>/.test(JSON.stringify(output_format)); // Check for placeholders in format
    const list_output = /\[.*?\]/.test(JSON.stringify(output_format)); // Check if output is a list

    let error_msg = ""; // Append errors to guide next attempts

    for (let i = 0; i < num_tries; i++) {
      let output_format_prompt = `\nYou are to output ${
        list_output ? "an array of objects in" : ""
      } the following in JSON format: ${JSON.stringify(output_format)}. 
      Do not include any markdown formatting or code block indicators in your response.`;

      if (list_output) {
        output_format_prompt += `\nIf the output field is a list, classify output into the best element of the list.`;
      }

      if (dynamic_elements) {
        output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example: '<location>' -> 'garden'.`;
      }

      if (list_input) {
        output_format_prompt += `\nGenerate an array of JSON, one for each input element.`;
      }

      try {
        const generationConfig = {
          temperature: temperature,
          topK: 1,
          topP: 1,
        };

        const fullPrompt = `${system_prompt}${output_format_prompt}${error_msg}\n\n${user_prompt.toString()}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;

        if (!response.text()) {
          throw new Error("Empty response from Gemini API");
        }

        // Remove markdown or code block indicators
        let res = response.text().replace(/```json\n?|\n?```/g, "").trim();

        if (verbose) {
          console.log("System prompt:", system_prompt + output_format_prompt + error_msg);
          console.log("\nUser prompt:", user_prompt);
          console.log("\nGemini response:", res);
        }

        let output: any;
        try {
          output = JSON.parse(res);
        } catch (parseError) {
          if (parseError instanceof Error) {
            throw new Error(`Failed to parse JSON response: ${parseError.message}\nResponse: ${res}`);
          } else {
            throw new Error(`Failed to parse JSON response: ${res}`);
          }
        }

        if (list_input && !Array.isArray(output)) {
          throw new Error("Output format not in an array of JSON");
        }

        if (!list_input) {
          output = [output];
        }

        for (let index = 0; index < output.length; index++) {
          for (const key in output_format) {
            if (/<.*?>/.test(key)) continue;

            if (!(key in output[index])) {
              throw new Error(`${key} not in JSON output`);
            }

            if (Array.isArray(output_format[key])) {
              const choices = output_format[key] as string[];
              if (Array.isArray(output[index][key])) {
                output[index][key] = output[index][key][0];
              }
              if (!choices.includes(output[index][key]) && default_category) {
                output[index][key] = default_category;
              }
              if (output[index][key].includes(":")) {
                output[index][key] = output[index][key].split(":")[0];
              }
            }
          }

          if (output_value_only) {
            output[index] = Object.values(output[index]);
            if (output[index].length === 1) {
              output[index] = output[index][0];
            }
          }
        }

        return list_input ? output : output[0];
      } catch (e: any) {
        error_msg = `\n\nError occurred: ${e.message}`;
        console.error(`Attempt ${i + 1} failed:`, verbose ? e : e.message);

        if (e.message.includes("429 Too Many Requests")) {
          console.warn("Rate limit hit. Retrying after delay...");
          await delay(2000); // Add a delay if rate-limited
        }

        if (i === num_tries - 1) {
          console.error("Max retries reached. Returning empty array.");
          return [];
        }
      }
    }

    return [];
  } catch (e: any) {
    console.error("Fatal error:", e.message);
    throw new Error(`Failed to initialize Gemini API: ${e.message}`);
  }
}

/**
 * Example usage of `strict_output` for sequential or batched processing.
 */
export async function process_prompts_sequentially(
  system_prompt: string,
  user_prompts: string[],
  output_format: OutputFormat,
  verbose: boolean = false
): Promise<any[]> {
  const results: any[] = [];
  for (const prompt of user_prompts) {
    const result = await strict_output(system_prompt, prompt, output_format, "", false, "gemini-1.5-flash", 1, 3, verbose);
    results.push(result);
  }
  return results;
}

export async function process_prompts_in_batches(
  system_prompt: string,
  user_prompts: string[],
  output_format: OutputFormat,
  batchSize: number = 3,
  verbose: boolean = false
): Promise<any[]> {
  const results: any[] = [];
  for (let i = 0; i < user_prompts.length; i += batchSize) {
    const batch = user_prompts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((prompt) =>
        strict_output(system_prompt, prompt, output_format, "", false, "gemini-1.5-flash", 1, 3, verbose)
      )
    );
    results.push(...batchResults);
  }
  return results;
}
