import React from "react";
import { CategoriesList } from "../_shared/CategoryList";
import Image from "next/image";

const SelectCategory = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        {/* Title Section */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Choose a Category 📚
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {CategoriesList.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 border border-gray-300 rounded-xl shadow-lg hover:border-primary hover:bg-blue-50 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {/* Category Icon */}
              <div className="mb-4">
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={70}
                  height={70}
                  className="object-contain"
                />
              </div>
              
              {/* Category Name */}
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>

              {/* Hover Effect - Border and Background Change */}
              <div className="mt-4 w-full text-center text-blue-500 font-medium hidden group-hover:block">
                <span>Explore</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCategory;
