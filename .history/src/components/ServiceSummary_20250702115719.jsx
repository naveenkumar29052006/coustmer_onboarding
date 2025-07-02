import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import SafeSidebarWrapper from './SafeSidebarWrapper';
import ProposalTable from './ProposalTable';
import ButtonContainer from './ButtonContainer';

const ServiceSummary = ({ onBack, onContinue }) => {
    const { formState } = useOnboarding();
    const { serviceDetails } = formState;

    // Calculate step status for sidebar
    const allBasicDetailsFilled =
        !!formState.responsibility &&
        !!formState.businessCategory &&
        !!formState.valuationRange &&
        !!formState.employeeCount;

    const servicesSelected = formState.selectedServices && formState.selectedServices.length > 0;
    const allAdditionalInfoFilled =
        servicesSelected &&
        (formState.serviceDetails || []).length === formState.selectedServices.length &&
        formState.serviceDetails.every(detail => detail.service);

    const userLoggedIn = false; // This will be handled in the next step
    const proposalSent = false; // This will be handled in the final step

    const stepStatus = [
        allBasicDetailsFilled,
        allAdditionalInfoFilled,
        userLoggedIn,
        proposalSent
    ];

    // Check if service details are available
    if (!serviceDetails || serviceDetails.length === 0) {
        return (
            <SafeSidebarWrapper stepStatus={stepStatus}>
                <OnboardingLayout>
                    <div className="min-h-screen flex items-center justify-center">
                        <p>No service details available.</p>
                    </div>
                </OnboardingLayout>
            </SafeSidebarWrapper>
        );
    }

    return (
        <SafeSidebarWrapper stepStatus={stepStatus}>
            <OnboardingLayout>
                <div className="w-full flex flex-col items-center justify-center gap-6 py-6 bg-transparent p-0 relative min-h-[70vh]">
                    <div className="w-full flex flex-col items-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#222] font-poppins" style={{ fontWeight: 600, lineHeight: '1.2' }}>
                            Service <span className="text-[#FF8000]">Summary</span>
                        </h1>
                        <p className="text-base text-center text-gray-500 mb-6">
                            Here's a summary of your selected services and pricing.
                        </p>
                        <div className="w-full mb-6 flex justify-center">
                            <ProposalTable serviceDetails={serviceDetails} />
                        </div>
                        <ButtonContainer
                            onBack={onBack}
                            onContinue={onContinue}
                            showGenerateButton={true}
                        />
                    </div>
                </div>
            </OnboardingLayout>
        </SafeSidebarWrapper>
    );
};

export default ServiceSummary;