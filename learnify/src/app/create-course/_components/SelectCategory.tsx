    import React, { useContext } from "react";
    import { UserInputContext } from "@/app/_context/UserInputcontext";
    import { CategoriesList } from "../_shared/CategoryList";
    import Image from "next/image";

    interface SelectCategoryProps {}

    const SelectCategory: React.FC<SelectCategoryProps> = () => {
      const { userCourseInput, setUserCourseInput } = useContext<UserInputContextType>(UserInputContext);

      const handleCategoryChange = (category: string) => {
        setUserCourseInput((prev: any) => ({
          ...prev,
          category,
        }));
      };

      return (
        <div className="px-10">
          <h2 className="text-xl font-bold mb-5">Select the Course Category</h2>
          <div className="grid grid-cols-2 gap-6">
            {CategoriesList.map((item: Category, index: number) => (
              <div
                key={index}
                onClick={() => handleCategoryChange(item.name)}
                className={`border p-4 rounded-lg ${
                  userCourseInput?.category === item.name
                    ? "bg-blue-50 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <Image src={item.icon} alt={item.name} width={50} height={50} />
                <h3 className="mt-2">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      );
    };

export default SelectCategory;
