import { UserInputContext } from "@/app/_context/UserInputcontext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Value } from "@radix-ui/react-select";
import { useContext } from "react";

function SelectOption() {
     const {userCourseInput , setUserCourseInput} = useContext(UserInputContext);
    
      const handleTopicChange = (fieldName, value) => {
        setUserCourseInput((prev: any) => ({
          ...prev,
          [fieldName]: value,
        }));
      }

    function handleInputChange(fieldName: string, value: string): void {
        setUserCourseInput((prev: any) => ({
          ...prev,
          [fieldName]: value,
        }));
    }
  return (
    <div className="px-10 md:px-20 lg:px-44 py-10 bg-gray-50 rounded-lg shadow-lg">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🎓 Course Options</h2>

      {/* Form Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Difficulty Level */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              🔥 Difficulty Level
            </label>
            <Select onValueChange={(value) => handleInputChange('Difficultylevel', value)}
                defaultValue={userCourseInput?.Difficultylevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              ⏰ Course Duration
            </label>
            <Select onValueChange={(value) => handleInputChange('duration', value)}
                defaultValue={userCourseInput?.duration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 Hour">1 Hour</SelectItem>
                <SelectItem value="2 Hours">2 Hours</SelectItem>
                <SelectItem value="3 Hours">3 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Add Video */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              🎥 Add Video
            </label>
            <Select onValueChange={(value) => handleInputChange('displayvideo', value)}
                defaultValue={userCourseInput?.displayvideo}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Number of Chapters */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              📚 Number of Chapters
            </label>
            <Input
              type="number"
              className="w-full"
              placeholder="Enter number of chapters"
              onChange={(event) => handleInputChange('numberOfChapters', event.target.value)}
              defaultValue={userCourseInput?.numberOfChapters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectOption;
