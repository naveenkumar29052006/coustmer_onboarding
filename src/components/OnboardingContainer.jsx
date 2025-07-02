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
        <div className="relative">
            {/* Background image with reduced opacity */}
            <div
                className="fixed inset-0 w-full h-full z-0 bg-repeat-y"
                style={{
                    backgroundImage: 'url(/backdrop.png)',
                    backgroundSize: '100% 50%',  // Makes it repeat only twice vertically
                    backgroundPosition: 'center',
                    opacity: '0.07'  // Reduced opacity
                }}
            ></div>

            {currentView === 'shareDetails' ? (
                <ShareDetailsPage onPrevious={() => setCurrentViewWithLog('home')} />
            ) : (
            <OnboardingLayout stepStatus={contextStepStatus}>
                <div className='w-full max-w-5xl mx-auto flex flex-col items-center py-6 pb-12 bg-transparent p-6 relative min-h-[70vh] font-poppins z-10'>
                    {currentView === 'home' ? (
                        <>
                            {/* Main heading with the second word in orange */}
                            <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#222] font-poppins" style={{ fontWeight: 600, lineHeight: '1.2' }}>
                                Answer a few quick <span className="text-[#FF8000]">questions</span>
                            </h1>
                            <p className="text-base text-center text-gray-500 mb-6 font-poppins" style={{ fontWeight: 500, lineHeight: '1.5', maxWidth: '700px' }}>
                                Answer a few quick questions, and we'll guide you through the next steps.
                            </p>
                            {/* Accordion only */}
                            <div className="w-full mb-6">
                                <div className="space-y-5">
                                    {steps.map((step, idx) => {
                                            // Hide Employee Count if 'Yet to begin' is selected
                                        if (idx === 3 && formState.valuationRange === "Yet to begin") {
                                            return null;
                                        }
                                            // Hide Employee Count and Preferred Services if 'Above all of this' is selected
                                            if ((idx === 3 || idx === 4) && formState.valuationRange === "Above all of this") {
                                                return null;
                                            }

                                        const isCompleted = isStepCompleted(idx);
                                        const getFieldName = (title) => {
                                            return title === 'Preferred Services' ? 'selectedServices' : 
                                                title === 'Areas of Responsibility' ? 'responsibility' :
                                                title === 'Nature of Business' ? 'businessCategory' :
                                                title === 'Business Financial Overview' ? 'valuationRange' :
                                                title === 'Number of Employees' ? 'employeeCount' :
                                                title.replace(/\s+/g, '').charAt(0).toLowerCase() + title.replace(/\s+/g, '').slice(1);
                                        };
                                        
                                        const fieldName = getFieldName(step.title);
                                        const isOptionSelected = step.options && formState && formState[fieldName] && (
                                            Array.isArray(formState[fieldName])
                                                ? formState[fieldName].length > 0
                                                : !!formState[fieldName]
                                        );
                                        return (
                                            <div
                                                key={step.title}
                                                className="border border-gray-200/50 rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                                                style={{
                                                    background: 'var(--Background-Primary, #FFFFFF)',
                                                    width: '1000px',
                                                    borderRadius: '12px'
                                                }}
                                            >
                                                <button
                                                    className="w-full flex items-center focus:outline-none bg-transparent relative"
                                                    style={{
                                                        ...(idx === 2 ? {
                                                            width: '1000px',
                                                            height: '80px',
                                                            justifyContent: 'flex-start',
                                                            alignItems: 'center',
                                                            padding: '32px',
                                                            borderRadius: '12px',
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: 500,
                                                            fontSize: '20px',
                                                            color: 'var(--Content-Secondary, #333333)',
                                                        } : {}),
                                                        ...(idx === 1 ? {
                                                            width: '1000px',
                                                            height: '80px',
                                                            justifyContent: 'flex-start',
                                                            padding: '32px',
                                                            borderRadius: '12px',
                                                        } : {}),
                                                        ...(idx === 0 ? {
                                                            width: '1000px',
                                                            height: '80px',
                                                            justifyContent: 'flex-start',
                                                            padding: '32px',
                                                            borderRadius: '12px',
                                                            boxShadow: '0px 0px 2px 0px #534DAF14, 0px 2px 4px 0px #534DAF14',
                                                        } : {}),
                                                        ...(idx === 3 ? {
                                                            width: '1000px',
                                                            height: '80px',
                                                            justifyContent: 'flex-start',
                                                            padding: '32px',
                                                            borderRadius: '12px',
                                                        } : {}),
                                                        ...(idx === 4 ? {
                                                            width: '1000px',
                                                            height: '80px',
                                                            justifyContent: 'flex-start',
                                                            padding: '32px',
                                                            borderRadius: '12px',
                                                        } : {})
                                                    }}
                                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                                >
                                                    <div className="flex items-center flex-1 min-w-0" style={{ height: '32px' }}>
                                                        <div className="relative rounded-full flex items-center justify-center mr-3 transition-colors border-2" style={{ width: 32, height: 32, borderColor: isOptionSelected ? 'var(--Content-Positive, #009933)' : '#FF8000', background: 'transparent' }}>
                                                            {isOptionSelected ? (
                                                                <span style={{ width: '28px', height: '28px', background: 'var(--Content-Positive, #009933)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                                                                        <path d="M2 5.5L6 9L12 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                        <span
                                                            className="font-poppins font-medium truncate"
                                                            style={{
                                                                color: isOptionSelected ? 'var(--Content-Positive, #009933)' : 'var(--Content-Secondary, #333333)',
                                                                fontFamily: 'Poppins, sans-serif',
                                                                fontWeight: 500,
                                                                fontSize: '20px',
                                                                lineHeight: '24px',
                                                                letterSpacing: '0.01em',
                                                                verticalAlign: 'middle',
                                                                height: '32px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            {step.title}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className="flex items-center justify-center"
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            position: 'absolute',
                                                            right: 32,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            color: isOptionSelected ? '#009933' : '#FF8000',
                                                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        }}
                                                    >
                                                        {openIndex === idx ? (
                                                            <svg width="18.67" height="18.67" viewBox="0 0 18.67 18.67" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="0" y="8.33" width="18.67" height="2" rx="1" fill={isOptionSelected ? '#009933' : '#FF8000'} />
                                                            </svg>
                                                        ) : (
                                                            <svg width="18.67" height="18.67" viewBox="0 0 18.67 18.67" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="0" y="8.33" width="18.67" height="2" rx="1" fill={isOptionSelected ? '#009933' : '#FF8000'} />
                                                                <rect x="8.33" y="0" width="2" height="18.67" rx="1" fill={isOptionSelected ? '#009933' : '#FF8000'} />
                                                        </svg>
                                                        )}
                                                    </span>
                                                </button>
                                                {/* Divider with shadow for every step, only show when open */}
                                                {openIndex === idx && (
                                                    <div style={{
                                                        width: '1000px',
                                                        height: '2px',
                                                        background: 'transparent',
                                                        borderBottom: '1px solid #e0e0e0',
                                                        boxShadow: '0px 2px 4px 0px #534DAF33',
                                                        margin: 0,
                                                    }} />
                                                )}
                                                <div
                                                    ref={el => (contentRefs.current[idx] = el)}
                                                    className="transition-max-height duration-700 ease-in-out overflow-hidden"
                                                    style={{
                                                        maxHeight: openIndex === idx ? `${contentRefs.current[idx]?.scrollHeight}px` : '0px',
                                                    }}
                                                >
                                                    <div
                                                        className="flex flex-row flex-wrap items-center"
                                                        style={{
                                                            width: idx === 2 ? '1000px' : (idx === 1 || idx === 0) ? '1000px' : '1000px',
                                                            height: idx === 2 ? '254px' : idx === 1 ? '174px' : idx === 0 ? '135px' : idx === 3 ? '115px' : idx === 4 ? '200px' : '115px',
                                                            gap: '10px',
                                                            rowGap: '10px',
                                                            borderBottomRightRadius: '12px',
                                                            borderBottomLeftRadius: '12px',
                                                            paddingTop: idx === 2 ? '32px' : (idx === 1) ? '32px' : idx === 0 ? '50px' : idx === 3 ? '32px' : idx === 4 ? '32px' : '32px',
                                                            paddingBottom: idx === 2 ? '32px' : (idx === 1) ? '32px' : idx === 0 ? '50px' : idx === 3 ? '32px' : idx === 4 ? '32px' : '32px',
                                                            paddingLeft: '24px',
                                                            paddingRight: '24px',
                                                            background: '#fff',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                        {/* Currency selection for Business Financial Overview */}
                                                        {idx === 2 && (
                                                            <div style={{ 
                                                                display: 'flex', 
                                                                flexDirection: 'row', 
                                                                alignItems: 'center', 
                                                                gap: 12, 
                                                                width: '100%', 
                                                                marginBottom: 16 
                                                            }}>
                                                                <p style={{ 
                                                                    color: 'var(--Content-Tertiary, #666666)', 
                                                                    fontSize: '14px', 
                                                                    fontWeight: 500, 
                                                                    margin: 0,
                                                                    whiteSpace: 'nowrap'
                                                                }}>
                                                                    Choose Currency:
                                                                </p>
                                                                {[
                                                                    { symbol: "₹", name: "INR" },
                                                                    { symbol: "€", name: "EUR" },
                                                                    { symbol: "$", name: "USD" }
                                                                ].map((curr) => {
                                                                    const isSelected = formState.currency === curr.name;
                                                                    return (
                                                                        <button
                                                                            key={curr.name}
                                                                            onClick={() => updateField('currency', curr.name)}
                                                                            style={{
                                                                                minWidth: '83px',
                                                                                height: '35px',
                                                                                borderRadius: '9999px',
                                                                                padding: '8px 24px',
                                                                                background: isSelected ? 'var(--Background-Notice, #FF8000)' : 'var(--Background-Primary, #FFFFFF)',
                                                                                color: isSelected ? 'var(--Primary-White, #FFFFFF)' : 'var(--Content-Secondary, #333333)',
                                                                                border: isSelected ? '2px solid #FF8000' : '2px solid var(--Background-Primary, #FFFFFF)',
                                                                                fontFamily: 'DM Sans, sans-serif',
                                                                                fontWeight: 400,
                                                                                fontSize: 'var(--Text-L-Regular-Size)',
                                                                                lineHeight: 'var(--Text-L-Regular-Line-Height)',
                                                                                letterSpacing: 'var(--Text-L-Regular-Letter-Spacing)',
                                                                                verticalAlign: 'middle',
                                                                                margin: 0,
                                                                                cursor: 'pointer',
                                                                                transition: 'all 0.2s',
                                                                                outline: isSelected ? 'none' : undefined,
                                                                                boxShadow: '0px 0px 2px 0px #534DAF14, 0px 2px 4px 0px #534DAF14',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                textAlign: 'center',
                                                                                gap: '8px'
                                                                            }}
                                                                            aria-pressed={isSelected}
                                                                        >
                                                                            <div style={{
                                                                                width: 20,
                                                                                height: 20,
                                                                                background: isSelected ? 'var(--Primary-White, #FFFFFF)' : 'var(--Background-Notice-Neutral, #FFF3E6)',
                                                                                borderRadius: '50%',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center'
                                                                            }}>
                                                                                <span style={{ 
                                                                                    color: 'var(--Background-Notice, #FF8000)', 
                                                                                    fontSize: '12px', 
                                                                                    fontWeight: 500 
                                                                                }}>
                                                                                    {curr.symbol}
                                                                                </span>
                                                                            </div>
                                                                            <span style={{ 
                                                                                color: isSelected ? 'var(--Primary-White, #FFFFFF)' : 'var(--Content-Secondary, #333333)', 
                                                                                fontSize: '12px', 
                                                                                fontWeight: 500 
                                                                            }}>
                                                                                {curr.name}
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        {/* Render each option as a box */}
                                                        <div style={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: idx === 4 ? '12px' : '10px',
                                                            width: '100%',
                                                            justifyContent: idx === 4 ? 'flex-start' : 'flex-start',
                                                            maxWidth: idx === 4 ? '1000px' : undefined
                                                        }}>
                                                            {step.options && step.options.map((option, i) => {
                                                                const fieldName = getFieldName(step.title);
                                                                const isMulti = step.title === 'Preferred Services';
                                                                const optionIndex = step.options.indexOf(option) + 1;
                                                                const isSelected = isMulti
                                                                    ? (formState.selectedServices || []).includes(optionIndex)
                                                                    : formState[fieldName] === option;
                                                                const handleOptionClick = () => {
                                                                    if (isMulti) {
                                                                        const newArr = (formState.selectedServices || []).includes(optionIndex)
                                                                            ? formState.selectedServices.filter(o => o !== optionIndex)
                                                                            : [...(formState.selectedServices || []), optionIndex];
                                                                        updateField('selectedServices', newArr);
                                                                    } else {
                                                                        updateField(fieldName, option);
                                                                    }
                                                                };
                                                                // Preferred Services pill style
                                                                if (idx === 4) {
                                                                    return (
                                                                        <button
                                                                            key={i}
                                                                            type="button"
                                                                            onClick={handleOptionClick}
                                                                            style={{
                                                                                height: '40px',
                                                                                borderRadius: '9999px',
                                                                                padding: '8px 24px',
                                                                                background: isSelected ? 'var(--Background-Notice, #FF8000)' : 'var(--Background-Primary, #FFFFFF)',
                                                                                color: isSelected ? 'var(--Primary-White, #FFFFFF)' : 'var(--Content-Secondary, #333333)',
                                                                                border: isSelected ? '2px solid #FF8000' : '2px solid var(--Background-Primary, #FFFFFF)',
                                                                                fontFamily: 'DM Sans, sans-serif',
                                                                                fontWeight: 400,
                                                                                fontSize: 'var(--Size-M)',
                                                                                lineHeight: 'var(--Line-Height-M)',
                                                                                letterSpacing: 0,
                                                                                verticalAlign: 'middle',
                                                                                boxShadow: '0px 2px 8px 0px #534DAF14',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                margin: 0,
                                                                                cursor: 'pointer',
                                                                                transition: 'all 0.2s',
                                                                                whiteSpace: 'nowrap',
                                                                            }}
                                                                            aria-pressed={isSelected}
                                                                        >
                                                                            {option}
                                                                        </button>
                                                                    );
                                                                }
                                                                // Default for other steps
                                                                return (
                                                                    <button
                                                                        key={i}
                                                                        type="button"
                                                                        onClick={handleOptionClick}
                                                                        style={{
                                                                            minWidth: '83px',
                                                                            height: '35px',
                                                                            borderRadius: '9999px',
                                                                            padding: '8px 24px',
                                                                            background: isSelected ? 'var(--Background-Notice, #FF8000)' : 'var(--Background-Primary, #FFFFFF)',
                                                                            color: isSelected ? 'var(--Primary-White, #FFFFFF)' : 'var(--Content-Secondary, #333333)',
                                                                            border: isSelected ? '2px solid #FF8000' : '2px solid var(--Background-Primary, #FFFFFF)',
                                                                            fontFamily: 'DM Sans, sans-serif',
                                                                            fontWeight: 400,
                                                                            fontSize: 'var(--Text-L-Regular-Size)',
                                                                            lineHeight: 'var(--Text-L-Regular-Line-Height)',
                                                                            letterSpacing: 'var(--Text-L-Regular-Letter-Spacing)',
                                                                            verticalAlign: 'middle',
                                                                            margin: 0,
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.2s',
                                                                            outline: isSelected ? 'none' : undefined,
                                                                            boxShadow: '0px 0px 2px 0px #534DAF14, 0px 2px 4px 0px #534DAF14',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            textAlign: 'center',
                                                                        }}
                                                                        aria-pressed={isSelected}
                                                                    >
                                                                        {option}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="w-full flex justify-end">
                                <button
                                    className="btn-primary btn-primary-continue"
                                    onClick={handleContinue}
                                >
                                    Continue
                                    <svg className="btn-icon-right" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        renderContent()
                    )}
                </div>
            </OnboardingLayout>
            )}
            <style jsx>{`
                .radio-button {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border: 2px solid #FF8000;
                    border-radius: 50%;
                    margin-right: 10px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .radio-button:checked {
                    background-color: #FF8000;
                    border-color: #FF8000;
                }
                .radio-button:checked::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: white;
                }
                .completed-step {
                    background-color: #4CAF50;
                    border-color: #4CAF50;
                }
                .completed-step::after {
                    content: '✓';
                    color: white;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
};

export default OnboardingContainer;