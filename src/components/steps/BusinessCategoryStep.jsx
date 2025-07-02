import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";

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

const BusinessCategoryStep = () => {
    const { formState, updateField } = useOnboarding();
    const selectedIndustry = formState.businessCategory || "";

    const handleSelect = (industry) => {
        updateField("businessCategory", industry);
    };

    return (
        <div className="flex flex-col gap-6 w-full font-poppins">
            <p className="text-sm text-neutral-600 font-medium font-poppins">
                Select the category that best describes your core business activity.
            </p>

            <div className="flex flex-wrap gap-4 w-full">
                {industries.map((industry) => (
                    <button
                        key={industry}
                        onClick={() => handleSelect(industry)}
                        className={`px-5 py-3 rounded-full text-sm transition-all font-poppins ${selectedIndustry === industry
                            ? "bg-[#FF8000] text-white"
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

export default BusinessCategoryStep;
