import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";

const roles = [
    "Founder",
    "Finance Leader",
    "Finance Team Member",
    "Finance Consultant",
    "Others",
];

const AreaOfResponsibilityStep = () => {
    const { formState, updateField } = useOnboarding();
    const selectedRole = formState.responsibility || "";

    const handleSelect = (role) => {
        updateField("responsibility", role);
    };

    return (
        <div className="flex flex-col gap-6 w-full font-poppins">
            <p className="text-sm text-neutral-600 font-medium font-poppins">
                Choose the function you're primarily involved in.
            </p>

            <div className="flex flex-wrap gap-4 w-full">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() => handleSelect(role)}
                        className={`px-5 py-3 rounded-full text-sm transition-all font-poppins flex justify-center items-center text-center ${selectedRole === role
                            ? "bg-[#FF8000] text-white"
                            : "bg-[var(--Background-Primary,#FFFFFF)] border border-gray-400 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {role}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AreaOfResponsibilityStep;
