import React, { useState, useRef, useEffect } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import AreaOfResponsibilityStep from './steps/AreaOfResponsibilityStep';
import BusinessCategoryStep from './steps/BusinessCategoryStep';
import FinancialOverviewStep from './steps/FinancialOverviewStep';
import EmployeeCountStep from './steps/EmployeeCountStep';
import ServicesStep from './steps/ServicesStep';
import SubserviceStep from './steps/SubserviceStep';
import SelectedServicesSummary from './SelectedServicesSummary';
import ProposalPage from './ProposalPage';
import { toast } from 'react-hot-toast';
import servicesConfig from './servicesConfig';
import OnboardingLayout from './OnboardingLayout';
import { useAuth } from '../context/AuthContext';
import HomePage from './HomePage';
import SafeSidebarWrapper from './SafeSidebarWrapper';
import { useSidebar } from '../context/SidebarContext';
import FigmaSpecialStep from './FigmaSpecialStep';
import ShareDetailsPage from './ShareDetailsPage';
import AuthPopup from './AuthPopup';


const steps = [
    { title: 'Areas of Responsibility', component: <AreaOfResponsibilityStep />, options: ["Founder", "Finance Leader", "Finance Team Member", "Finance Consultant", "Others"] },
    { title: 'Nature of Business', component: <BusinessCategoryStep />, options: ["Technology", "Infra & Real Estate", "Education", "Life science", "Finance Services", "Hospitality", "Manufacturing", "Retails & Consumers", "Services", "Others"] },
    { title: 'Business Financial Overview', component: <FinancialOverviewStep />, options: ["Yet to begin", "Under 1 Crore", "1-10 Crore", "10-50 Crore", "50-100 Crore", "Above 100 Crore", "Above all of this"] },
    { title: 'Number of Employees', component: <EmployeeCountStep />, options: ["0-10", "11-50", "51-200", "201-1000", "Above 1000"] },
    { title: 'Preferred Services', component: <ServicesStep />, options: ["Zoho", "Finance Operation Automation", "Payroll", "Accounting", "Compliances", "Advisory Services", "Start a Business", "Hire a CFO", "Audit Support", "People Augmentation", "HR Support", "Customer Support"] },
];

const OnboardingContainer = ({ onComplete, onContinueToSubservice }) => {
    const {
        formState,
        currentStep,
        updateField,
        setCurrentStep
    } = useOnboarding();

    const { updateStepStatus, completeStep, stepStatus: contextStepStatus } = useSidebar();

    const [openIndex, setOpenIndex] = useState(0);
    const contentRefs = useRef([]);
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const { user } = useAuth();
    const [currentView, setCurrentView] = useState('home');
    const [figmaSpecial, setFigmaSpecial] = useState(false);

    // Check conditions for each step completion, but don't auto-mark them
    // We'll only check statuses for validation purposes, not automatically mark them
    const allBasicDetailsFilled =
        !!formState.responsibility &&
        !!formState.businessCategory &&
        !!formState.valuationRange &&
        (formState.valuationRange === "Yet to begin" || !!formState.employeeCount) &&
        formState.selectedServices && formState.selectedServices.length > 0;

    // Log currentView on every render
    useEffect(() => {
        console.log('[OnboardingContainer] Rendered. currentView:', currentView);
    });

    // Helper to log and set currentView
    const setCurrentViewWithLog = (view) => {
        console.log(`[OnboardingContainer] setCurrentView('${view}') called`);
        setCurrentView(view);
    };

    const handleContinue = () => {
        // If in the onboarding accordion ('home' view), validate all required fields before leaving
        if (currentView === 'home') {
            let missingFields = [];
            if (!formState.responsibility) missingFields.push('area of responsibility');
            if (!formState.businessCategory) missingFields.push('business category');
            if (!formState.valuationRange) missingFields.push('valuation range');
            if (!formState.currency) missingFields.push('currency');
            // Skip employee count and services check if 'Above all of this' is selected
            if (formState.valuationRange !== "Yet to begin" && formState.valuationRange !== "Above all of this" && !formState.employeeCount) missingFields.push('number of employees');
            if (formState.valuationRange !== "Above all of this" && (!formState.selectedServices || formState.selectedServices.length === 0)) missingFields.push('at least one service');
            if (missingFields.length > 0) {
                toast.error('Please select: ' + missingFields.join(', ') + ' to continue.');
                return;
            }
        }
        // Step is valid, increment currentStep
        setCurrentStep(currentStep + 1);
        if (formState.valuationRange === 'Above all of this') {
            setCurrentViewWithLog('shareDetails');
            return;
        }
        if (onContinueToSubservice) {
            onContinueToSubservice();
        } else {
            setCurrentViewWithLog('subservice');
        }
    };

    // Validate current step
    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1: // Responsibility
                return !!formState.responsibility;
            case 2: // Business Category
                return !!formState.businessCategory;
            case 3: // Financial Overview
                // Require both valuationRange and currency to be selected
                return !!formState.valuationRange && !!formState.currency;
            case 4: // Employee Count
                // Skip employee count validation if "Yet to begin" is selected
                if (formState.valuationRange === "Yet to begin") {
                    return true;
                }
                return !!formState.employeeCount;
            case 5: // Services
                return formState.selectedServices && formState.selectedServices.length > 0;
            case 6: // Sub-service
            case 7: // Proposal step
                return true;
            default:
                return true;
        }
    };

    // Check if a specific step is completed
    const isStepCompleted = (stepIndex) => {
        switch (stepIndex) {
            case 0: // Areas of Responsibility
                return !!formState.responsibility;
            case 1: // Nature of Business
                return !!formState.businessCategory;
            case 2: // Business Financial Overview
                return !!formState.valuationRange;
            case 3: // Number of Employees
                // If "Yet to begin" is selected, we skip this step, so consider it completed
                if (formState.valuationRange === "Yet to begin") {
                    return true;
                }
                return !!formState.employeeCount;
            case 4: // Preferred Services
                return formState.selectedServices && formState.selectedServices.length > 0;
            default:
                return false;
        }
    };

    // Is current step the last main step?
    const isLastMainStep = currentStep === 5 && formState.selectedServices.length === 0;



    const servicesSelected = formState.selectedServices && formState.selectedServices.length > 0;
    const allAdditionalInfoFilled =
        servicesSelected &&
        (formState.serviceDetails || []).length === formState.selectedServices.length &&
        formState.serviceDetails.every(detail => detail.service);

    // Update sidebar step status based on form completion
    useEffect(() => {
        const newStepStatus = [
            allBasicDetailsFilled,
            allAdditionalInfoFilled,
            false, // previewViewed - will be updated when user reaches preview
            !!user && !!user.email, // userLoggedIn
            !!formState.proposalSent // proposalSent
        ];
        
        // Only update if the status has actually changed
        newStepStatus.forEach((status, index) => {
            if (contextStepStatus[index] !== status) {
                updateStepStatus(index, status);
            }
        });
    }, [allBasicDetailsFilled, allAdditionalInfoFilled, user, formState.proposalSent, contextStepStatus, updateStepStatus]);

    const handleAboveAllOfThis = () => {
        setFigmaSpecial(true);
        // Optionally update sidebar here if needed
    };

    const handleSummaryContinue = () => {
        setCurrentViewWithLog('proposal');
    };

    // Render the appropriate component based on currentView
    const renderContent = () => {
        if (figmaSpecial) {
            return <FigmaSpecialStep onBack={() => setFigmaSpecial(false)} />;
        }
        switch (currentView) {
            case 'home':
                return <HomePage onContinueToAdditionalInfo={handleContinue} />;
            case 'shareDetails':
                return <ShareDetailsPage onPrevious={() => setCurrentViewWithLog('home')} />;
            case 'subservice':
                return <SubserviceStep
                    onBack={() => setCurrentViewWithLog('home')}
                    onComplete={() => setCurrentViewWithLog('summary')}
                />;
            case 'summary':
                return <SelectedServicesSummary
                    onBack={() => setCurrentViewWithLog('subservice')}
                    onComplete={handleSummaryContinue}
                />;
            case 'proposal':
                return <ProposalPage onComplete={onComplete} onBack={() => setCurrentViewWithLog('summary')} />;
            default:
                return <HomePage onContinueToAdditionalInfo={handleContinue} />;
        }
    };

    useEffect(() => {
        console.log('[OnboardingContainer] Mounted');
    }, []);

    return (
        <OnboardingLayout stepStatus={contextStepStatus} setCurrentView={setCurrentViewWithLog}>
            <SafeSidebarWrapper>
                <div className="w-full flex flex-col items-center justify-center min-h-screen">
                    {showAuthPopup ? (
                        <AuthPopup onClose={() => setShowAuthPopup(false)} />
                    ) : (
                        renderContent()
                    )}
                </div>
            </SafeSidebarWrapper>
        </OnboardingLayout>
    );
};

export default OnboardingContainer;