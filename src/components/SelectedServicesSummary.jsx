import React, { useState, useRef, useEffect } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { FaCheckCircle } from 'react-icons/fa';
import OnboardingLayout from './OnboardingLayout';
import SafeSidebarWrapper from './SafeSidebarWrapper';
import { useSidebar } from '../context/SidebarContext';
import ProposalTable from './ProposalTable';
import ButtonContainer from './ButtonContainer';

const SelectedServicesSummary = ({ onBack, onComplete }) => {
    const { formState } = useOnboarding();
    const { serviceDetails, subservices } = formState;

    // Get the setStepStatus function from sidebar context
    let setStepStatus;
    try {
        const sidebarContext = useSidebar();
        if (sidebarContext && sidebarContext.setStepStatus) {
            setStepStatus = sidebarContext.setStepStatus;
        }
    } catch (error) {
        console.warn("SidebarContext not available in SelectedServicesSummary:", error.message);
    }

    // Mark the "Preview" step as complete when this component mounts
    useEffect(() => {
        if (setStepStatus) {
            // First two steps are complete, and now we're on Preview (index 2)
            const statusArray = [true, true, true, false, false];
            setStepStatus(statusArray);
        }
    }, [setStepStatus]);

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

    const userLoggedIn = false; // Will be updated when user shares details
    const proposalSent = false; // Will be updated when proposal is sent

    const stepStatus = [
        allBasicDetailsFilled,
        allAdditionalInfoFilled,
        true, // Preview is being viewed now
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

    // Generate services for accordion display
    // const servicesForAccordion = serviceDetails.map((detail, index) => ({
    //     id: index,
    //     title: detail.service,
    //     option: detail.option,
    //     subOption: detail.sub_option
    // }));

    return (
        <SafeSidebarWrapper stepStatus={stepStatus}>
            <OnboardingLayout>
                <div className='w-full max-w-5xl flex flex-col items-start py-6 pb-12 bg-transparent p-6 relative min-h-[70vh] font-poppins' style={{overflowY: 'hidden'}}>
                    <div className="w-full" style={{ maxWidth: '1000px' }}>
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#222] font-poppins" style={{ fontWeight: 600, lineHeight: '1.2' }}>
                                Service <span className="text-[#FF8000]">Summary</span>
                    </h1>
                            <p className="text-base text-center text-gray-500 mb-6 font-poppins" style={{ fontWeight: 500, lineHeight: '1.5', maxWidth: '700px' }}>
                                Here's a summary of your selected services and pricing.
                    </p>
                        </div>
                        {/* Additional Selected Services Pricing */}
                        <div className="w-full mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 font-poppins"></h3>
                            <div className="overflow-x-auto">
                                <ProposalTable serviceDetails={serviceDetails} />
                            </div>
                        </div>
                        {/* Additional selected services - now inside the right-shifted container */}
                        {subservices.length > 0 && (
                            <div className="w-full mb-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 font-poppins">Additional Selected Services</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                {subservices.map((subservice, index) => (
                                        <div key={index} className="flex items-center p-4 bg-transparent rounded-lg shadow-sm border border-gray-100">
                                        <div className="w-5 h-5 min-w-[1.25rem] bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 font-poppins text-sm">{subservice}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Button container with Figma specs */}
                    <ButtonContainer
                        onBack={onBack}
                        onContinue={() => {
                            console.log('[SelectedServicesSummary] Generate Proposal clicked');
                            onComplete();
                        }}
                        showGenerateButton={true}
                    />
                </div>
                </div>
            </OnboardingLayout>
        </SafeSidebarWrapper>
    );
};

export default SelectedServicesSummary;