import React, { createContext, useContext, useState, useEffect } from "react";

// Initial state with all required fields
const initialState = {
    responsibility: "",
    businessCategory: "",
    valuationRange: "",
    employeeCount: "",
    selectedServices: [],
    // Sub-answers storage
    accountingSupportLevel: "",
    advisoryTypes: [],
    financeAutomationOption: "",
    financeAutomationSubOption: "",
    needsProposal: false,
    // Track which services need proposal
    serviceProposalStatus: {},
    additionalInfoCodes: [],
    // Store actual service details with names
    serviceDetails: [],
    proposalSent: false, // NEW: track if proposal was sent
    currency: "INR" // Default currency is INR
};

const OnboardingContext = createContext(null);

export const OnboardingProvider = ({ children }) => {
    // On mount, always clear onboarding state and step
    useEffect(() => {
        localStorage.removeItem('onboardingState');
        localStorage.removeItem('currentStep');
    }, []);

    // Function to load state from localStorage
    const loadState = () => {
        try {
            const serializedState = localStorage.getItem('onboardingState');
            if (serializedState === null) {
                return initialState;
            }
            return { ...initialState, ...JSON.parse(serializedState) };
        } catch (err) {
            return initialState;
        }
    };

    const loadStep = () => {
        try {
            const serializedStep = localStorage.getItem('currentStep');
            if (serializedStep === null) {
                return 1;
            }
            return parseInt(serializedStep, 10);
        } catch (err) {
            return 1;
        }
    };

    const [formState, setFormState] = useState(initialState);
    const [currentStep, setCurrentStep] = useState(1);

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('onboardingState', JSON.stringify(formState));
    }, [formState]);

    useEffect(() => {
        localStorage.setItem('currentStep', currentStep.toString());
    }, [currentStep]);

    // Update a specific field in the form state
    const updateField = (field, value) => {
        setFormState(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Reset the form to initial state
    const resetForm = () => {
        setFormState(initialState);
        setCurrentStep(1);
        localStorage.removeItem('onboardingState');
        localStorage.removeItem('currentStep');
    };

    // Mark a service as needing a proposal
    const markServiceForProposal = (service, status = true) => {
        setFormState(prev => ({
            ...prev,
            serviceProposalStatus: {
                ...prev.serviceProposalStatus,
                [service]: status
            }
        }));
    };

    // Check if all selected services are marked for proposal
    const checkAllServicesProposed = () => {
        const { selectedServices, serviceProposalStatus } = formState;
        return selectedServices.every(service => serviceProposalStatus[service]);
    };

    // Go to next step
    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    // Go to previous step
    const prevStep = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    // Set proposalSent flag
    const setProposalSent = (value) => {
        setFormState(prev => ({ ...prev, proposalSent: value }));
    };

    // Function to update sidebar status
    const updateSidebarStatus = (newStatus) => {
        // Just a stub function that will be replaced by SafeSidebarWrapper's implementation
        console.log('Sidebar status update requested:', newStatus);
    };

    return (
        <OnboardingContext.Provider value={{
            formState,
            updateField,
            resetForm,
            currentStep,
            setCurrentStep,
            nextStep,
            prevStep,
            markServiceForProposal,
            checkAllServicesProposed,
            setProposalSent,
            updateSidebarStatus
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
};