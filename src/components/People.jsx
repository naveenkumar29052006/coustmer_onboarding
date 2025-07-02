import React, { useState, useEffect } from "react";
import { useFormContext } from "../context/FormContext";

const employeeCounts = [
  "0-10",
  "11-50",
  "51-200",
  "201-1000",
  "Above 1000",
];

const People = ({ formValid }) => {
  const { formData, updateFormSection } = useFormContext();
  const [selectedCount, setSelectedCount] = useState(formData.people || "");

  useEffect(() => {
    updateFormSection("people", selectedCount);
  }, [selectedCount]);

  const handleSelect = (count) => {
    if (selectedCount === count) {
      setSelectedCount("");
    } else {
      setSelectedCount(count);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-neutral-600 font-medium">
        Let us know the approximate number of people in your company.
      </p>

      {!formValid && !selectedCount && (
        <div className="bg-transparent border border-red-500 p-3 rounded-md">
          <p className="text-sm text-red-600 font-medium">Please select employee count</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 w-full">
        {employeeCounts.map((count) => (
          <button
            key={count}
            onClick={() => handleSelect(count)}
            className={`px-5 py-3 rounded-full text-sm transition-all ${selectedCount === count
                ? "bg-[#FF8000] text-white"
                : "bg-transparent border border-gray-400 text-gray-700 hover:bg-transparent hover:border-gray-600"
              }`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
};

export default People;