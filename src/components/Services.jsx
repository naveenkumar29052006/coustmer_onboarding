import React, { useState, useEffect } from "react";
import { useFormContext } from "../context/FormContext";

const serviceOptions = [
  "Zoho",
  "Finance Operation Automation",
  "Payroll",
  "Accounting",
  "Compliances",
  "Advisory Services",
  "Start a Business",
  "Hire a CFO",
  "Audit Support",
  "People Augmentation",
  "HR Support",
  "Customer Support",
];

const Services = ({ formValid }) => {
  const { formData, updateFormSection } = useFormContext();
  const [selectedServices, setSelectedServices] = useState(formData.services || []);

  useEffect(() => {
    updateFormSection("services", selectedServices);
  }, [selectedServices]);

  const handleSelect = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-neutral-600 font-medium">
        Choose the services that best meet your needs (select all that apply).
      </p>

      {!formValid && selectedServices.length === 0 && (
        <div className="bg-transparent border border-red-500 p-3 rounded-md">
          <p className="text-sm text-red-600 font-medium">Please select at least one service</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 w-full">
        {serviceOptions.map((service) => (
          <button
            key={service}
            onClick={() => handleSelect(service)}
            className={`px-5 py-3 rounded-full text-sm transition-all ${selectedServices.includes(service)
                ? "bg-[#534DAF] text-white"
                : "bg-transparent border border-gray-400 text-gray-700 hover:bg-transparent hover:border-gray-600"
              }`}
          >
            {service}
          </button>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected services:</p>
          <div className="flex flex-wrap gap-2">
            {selectedServices.map(service => (
              <span key={service} className="bg-transparent border border-gray-400 px-3 py-1 rounded-full text-xs">
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;