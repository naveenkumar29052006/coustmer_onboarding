import React, { useState, useEffect } from "react";
import { useFormContext } from "../context/FormContext";

const valuationRanges = [
  "Yet to begin",
  "Under 1 Crore",
  "Under 1-10 Crore",
  "Under 10-50 Crore",
  "Under 50-100 Crore",
  "All of the above",
];

const Valuation = ({ formValid }) => {
  const { formData, updateFormSection } = useFormContext();
  const [selectedRange, setSelectedRange] = useState(formData.valuation || "");

  useEffect(() => {
    updateFormSection("valuation", selectedRange);
  }, [selectedRange]);

  const handleSelect = (range) => {
    if (selectedRange === range) {
      setSelectedRange("");
    } else {
      setSelectedRange(range);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-neutral-600 font-medium">
        Choose the valuation range that best reflects your business.
      </p>

      {!formValid && !selectedRange && (
        <div className="bg-transparent border border-red-500 p-3 rounded-md">
          <p className="text-sm text-red-600 font-medium">Please select a valuation range</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 w-full">
        {valuationRanges.map((range) => (
          <button
            key={range}
            onClick={() => handleSelect(range)}
            className={`px-5 py-3 rounded-full text-sm transition-all ${selectedRange === range
                ? "bg-[#534DAF] text-white"
                : "bg-transparent border border-gray-400 text-gray-700 hover:bg-transparent hover:border-gray-600"
              }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Valuation;