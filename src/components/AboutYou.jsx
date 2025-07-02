import React, { useState, useEffect } from "react";
import { useFormContext } from "../context/FormContext";

const roles = [
  "Founder",
  "Finance Leader",
  "Finance Team Member",
  "Finance Consultant",
  "Others",
];

const AboutYou = ({ formValid }) => {
  const { formData, updateFormSection } = useFormContext();
  const [selectedRole, setSelectedRole] = useState(formData.aboutYou || "");

  useEffect(() => {
    updateFormSection("aboutYou", selectedRole);
  }, [selectedRole]);

  const handleSelect = (role) => {
    if (selectedRole === role) {
      setSelectedRole("");
    } else {
      setSelectedRole(role);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-neutral-600 font-medium">
        Choose the function you're primarily involved in.
      </p>

      {!formValid && !selectedRole && (
        <div className="bg-transparent border border-red-500 p-3 rounded-md">
          <p className="text-sm text-red-600 font-medium">Please select an option</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 w-full">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleSelect(role)}
            className={`px-5 py-3 rounded-full text-sm transition-all ${selectedRole === role
                ? "bg-[#FF8000] text-white"
                : "bg-transparent border border-gray-400 text-gray-700 hover:bg-transparent hover:border-gray-600"
              }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AboutYou;