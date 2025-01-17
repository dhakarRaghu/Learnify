import { SignUp } from "@clerk/nextjs";
import { Sparkles } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="flex-1 hidden lg:block relative overflow-hidden">
        <Image
          src="/ai-tutor-image.jpg"
          alt="AI Tutor"
          layout="fill"
          objectFit="cover"
          className="animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 mix-blend-overlay" />
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center animate-bounce">
              {/* <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" /> */}
              <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400">
                CreativeTutor AI
              </span>
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100 animate-fade-in-up">
              Start your creative journey
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up delay-100">
              Sign up to unlock endless possibilities
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 animate-fade-in-up delay-200">
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-300",
                  formFieldInput:
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300",
                  footerActionLink:
                    "text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-300",
                },
              }}
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up delay-300">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

