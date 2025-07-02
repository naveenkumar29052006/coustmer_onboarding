import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";

const employeeCounts = [
    "0-10",
    "11-50",
    "51-200",
    "201-1000",
    "Above 1000",
];

const EmployeeCountStep = () => {
    const { formState, updateField } = useOnboarding();
    const selectedCount = formState.employeeCount || "";

    const handleSelect = (count) => {
        updateField("employeeCount", count);
    };

    return (
        <div className="flex flex-col gap-6 w-full font-poppins">
            <p className="text-sm text-neutral-600 font-medium font-poppins">
                Let us know the approximate number of people in your company.
            </p>

            <div className="flex flex-wrap gap-4 w-full">
                {employeeCounts.map((count) => (
                    <button
                        key={count}
                        onClick={() => handleSelect(count)}
                        className={`px-5 py-3 rounded-full text-sm transition-all font-poppins ${selectedCount === count
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

export default EmployeeCountStep;
