import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";

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

const ServicesStep = () => {
    const { formState, updateField, onComplete, updateAllStepStatus } = useOnboarding();
    const selectedServices = formState.selectedServices || [];

    const handleSelect = (service) => {
        const serviceIndex = serviceOptions.indexOf(service) + 1;
        const newSelectedServices = selectedServices.includes(serviceIndex)
            ? selectedServices.filter(s => s !== serviceIndex)
            : [...selectedServices, serviceIndex];
        updateField("selectedServices", newSelectedServices);
        updateField("serviceDetails", []);
        updateField("proposalSent", false);
    };

    // Handle Continue button click - mark first step as complete
    const handleContinue = () => {
        // Check if any service is selected
        if (!selectedServices || selectedServices.length === 0) {
            // Show an error message - using alert as fallback if toast isn't available
            try {
                alert('Please select at least one service to continue');
            } catch (error) {
                console.warn("Error showing service selection alert:", error.message);
            }
            return;
        }

        // Mark Basic Details step as complete ONLY if all required fields are filled
        try {
            const allBasicDetailsFilled =
                !!formState.responsibility &&
                !!formState.businessCategory &&
                !!formState.valuationRange &&
                !!formState.employeeCount &&
                selectedServices.length > 0;
            const statusArray = [allBasicDetailsFilled, false, false, false, false];
            updateAllStepStatus(statusArray);
        } catch (error) {
            console.warn("Error updating sidebar status:", error.message);
        }

        // Continue to next step
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <p className="text-sm text-neutral-600 font-medium font-poppins">
                Choose the services that best meet your needs (select all that apply).
            </p>

            <div className="flex flex-wrap gap-4 w-full overflow-hidden">
                {serviceOptions.map((service, idx) => (
                    <button
                        key={service}
                        onClick={() => handleSelect(service)}
                        className={`px-5 py-3 rounded-full text-sm transition-all font-poppins flex justify-center items-center text-center ${selectedServices.includes(idx + 1)
                            ? "bg-[#FF8000] text-white"
                            : "bg-transparent border border-gray-400 text-gray-700 hover:border-[#FF8000] hover:text-[#FF8000]"
                            }`}
                    >
                        {service}
                    </button>
                ))}
            </div>       
        </div>
    );
};

export default ServicesStep;
