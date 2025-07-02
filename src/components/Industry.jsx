import React, { useState, useEffect } from "react";
import { useFormContext } from "../context/FormContext";

const industries = [
  "Technology",
  "Infra & Real Estate",
  "Education",
  "Life science",
  "Finance Services",
  "Hospitality",
  "Manufacturing",
  "Retails & Consumers",
  "Services",
  "Others",
];

const Industry = ({ formValid }) => {
  const { formData, updateFormSection } = useFormContext();
  const [selectedIndustry, setSelectedIndustry] = useState(formData.industry || "");

  useEffect(() => {
    updateFormSection("industry", selectedIndustry);
  }, [selectedIndustry]);

  const handleSelect = (industry) => {
    if (selectedIndustry === industry) {
      setSelectedIndustry("");
    } else {
      setSelectedIndustry(industry);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-neutral-600 font-medium">
        Select the category that best describes your core business activity.
      </p>

      {!formValid && !selectedIndustry && (
        <div className="bg-transparent border border-red-500 p-3 rounded-md">
          <p className="text-sm text-red-600 font-medium">Please select an industry</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 w-full">
        {industries.map((industry) => (
          <button
            key={industry}
            onClick={() => handleSelect(industry)}
            className={`px-5 py-3 rounded-full text-sm transition-all ${selectedIndustry === industry
                ? "bg-[#534DAF] text-white"
                : "bg-transparent border border-gray-400 text-gray-700 hover:bg-transparent hover:border-gray-600"
              }`}
          >
            {industry}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Industry;