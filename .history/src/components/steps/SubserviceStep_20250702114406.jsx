import React, { useState, useEffect, useRef } from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import servicesConfig from '../servicesConfig';
import OnboardingLayout from '../OnboardingLayout';
import { useAuth } from '../../context/AuthContext';
import withSidebar from '../withSidebar';
import { toast } from 'react-hot-toast';
import ButtonContainer from '../ButtonContainer';

const SubserviceStep = ({ onBack, onComplete, setStepStatus }) => {
    const { formState, updateField } = useOnboarding();
    // Sanitize selectedServices: always array of numbers (indices+1)
    let { selectedServices } = formState;
    if (selectedServices && selectedServices.some(s => typeof s === 'string')) {
        selectedServices = selectedServices.map(s =>
            typeof s === 'number' ? s : (servicesConfig.findIndex(cfg => cfg.label === s) + 1)
        ).filter(idx => idx > 0);
    }
    const { user } = useAuth();
    const [selectedSubservices, setSelectedSubservices] = useState([]);
    const [selectionPaths, setSelectionPaths] = useState({});
    const contentRefs = useRef([]);
    const [openServiceNum, setOpenServiceNum] = useState(null);
    const [startBusinessDone, setStartBusinessDone] = useState({});

    // DEBUG: Log selectedServices and servicesConfig
    console.log('DEBUG selectedServices:', selectedServices);
    console.log('DEBUG servicesConfig:', servicesConfig);
    if (selectedServices) {
        selectedServices.forEach((serviceNum, idx) => {
            const configService = typeof serviceNum === 'number' ? servicesConfig[serviceNum - 1] : null;
            console.log(`DEBUG mapping serviceNum ${serviceNum} to configService:`, configService);
        });
    }

    // Second useEffect: Navigate away if no services selected
    useEffect(() => {
        // Instead of navigating away, call onBack if no services are selected
        if (!selectedServices || selectedServices.length === 0) {
            if (onBack) {
                onBack();
            }
        }
    }, [selectedServices, onBack]);

    // Third useEffect: Store service details with actual names instead of codes
    useEffect(() => {
        // Skip if no services
        if (!selectedServices) return;

        const serviceDetails = [];
        selectedServices.forEach(serviceNum => {
            const configService = typeof serviceNum === 'number' ? servicesConfig[serviceNum - 1] : null;
            if (!configService) return;
            // If service has no subcategories, store it directly
            if (!configService.subcategories || configService.subcategories.length === 0) {
                serviceDetails.push({
                    service: configService.label,
                    option: null,
                    sub_option: null
                });
                return;
            }
            const path = selectionPaths[serviceNum] || [];
            let current = configService.subcategories;
            let isLeaf = false;
            let option = null;
            let subOption = null;
            for (let i = 0; i < path.length; i++) {
                if (!current[path[i]]) return;
                if (i === 0) {
                    option = current[path[i]].label;
                } else if (i === 1) {
                    subOption = current[path[i]].label;
                }
                if (!current[path[i]].subcategories || current[path[i]].subcategories.length === 0) {
                    isLeaf = true;
                } else {
                    isLeaf = false;
                    current = current[path[i]].subcategories;
                }
            }
            if (isLeaf && path.length > 0) {
                serviceDetails.push({
                    service: configService.label,
                    option: option,
                    sub_option: subOption
                });
            }
        });
        // Only update if changed
        const current = formState.serviceDetails || [];
        const isEqual = JSON.stringify(current) === JSON.stringify(serviceDetails);
        if (!isEqual) {
            updateField('serviceDetails', serviceDetails);
        }
    }, [selectionPaths, selectedServices, formState.serviceDetails, updateField]);

    // If no services are selected, render a loading state instead of returning null
    if (!selectedServices || selectedServices.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    // Handle option/sub-option selection
    const handleSelect = (serviceNum, level, idx) => {
        setSelectionPaths(prev => {
            const prevPath = prev[serviceNum] || [];
            const newPath = [...prevPath.slice(0, level), idx];
            return { ...prev, [serviceNum]: newPath };
        });
    };

    // Accordion UI for each selected service
    const renderAccordion = (serviceNum) => {
        const configService = typeof serviceNum === 'number' ? servicesConfig[serviceNum - 1] : null;
        if (!configService) return null;
        const hasOptions = configService.subcategories && configService.subcategories.length > 0;
        const isOpen = openServiceNum === serviceNum;
        const path = selectionPaths[serviceNum] || [];

        // Special logic for 'Start a Business'
        const isStartBusiness = configService.label === 'Start a Business';
        const isStartBusinessDone = startBusinessDone[serviceNum];

        // Determine if tick should be shown
        let showTick = false;
        if (isStartBusiness) {
            showTick = !!isStartBusinessDone;
        } else if (!hasOptions) {
            showTick = true;
        } else {
            let current = configService.subcategories;
            let complete = true;
            for (let i = 0; i < path.length; i++) {
                if (!current[path[i]]) {
                    complete = false;
                    break;
                }
                if (current[path[i]].subcategories && current[path[i]].subcategories.length > 0) {
                    current = current[path[i]].subcategories;
                } else {
                    complete = (i === path.length - 1);
                    break;
                }
            }
            showTick = complete && path.length > 0;
        }

        // Onboarding-style circle
        const Circle = () => (
            <div
                className="relative rounded-full flex items-center justify-center border-2"
                style={{
                    width: 32,
                    height: 32,
                    borderColor: showTick ? 'var(--Content-Positive, #009933)' : '#FF8000',
                    background: 'transparent',
                }}
            >
                {showTick ? (
                    <span style={{ width: '28px', height: '28px', background: 'var(--Content-Positive, #009933)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                            <path d="M2 5.5L6 9L12 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                ) : null}
            </div>
        );

        // Onboarding-style plus/minus icon
        const PlusMinusIcon = () => (
            isOpen ? (
                <svg width="18.67" height="18.67" viewBox="0 0 18.67 18.67" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="8.33" width="18.67" height="2" rx="1" fill={showTick ? '#009933' : '#FF8000'} />
                </svg>
            ) : (
                <svg width="18.67" height="18.67" viewBox="0 0 18.67 18.67" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="8.33" width="18.67" height="2" rx="1" fill={showTick ? '#009933' : '#FF8000'} />
                    <rect x="8.33" y="0" width="2" height="18.67" rx="1" fill={showTick ? '#009933' : '#FF8000'} />
                </svg>
            )
        );

        return (
            <div key={serviceNum} className={`border border-gray-200/50 rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md mb-5`} style={{ background: 'var(--Background-Primary, #FFFFFF)', borderRadius: '12px', width: '100%' }}>
                <button
                    className="w-full flex items-center focus:outline-none bg-transparent relative"
                    style={{
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
                    }}
                    onClick={() => setOpenServiceNum(isOpen ? null : serviceNum)}
                >
                    <div className="flex items-center flex-1 min-w-0" style={{ height: '32px' }}>
                        <Circle />
                        <span
                            className="font-poppins font-medium truncate"
                            style={{
                                marginLeft: '12px',
                                color: showTick ? 'var(--Content-Positive, #009933)' : 'var(--Content-Secondary, #333333)',
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
                            {configService.label}
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
                            color: showTick ? '#009933' : '#FF8000',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        <PlusMinusIcon />
                    </span>
                </button>
                {/* Divider with shadow for every step, only show when open */}
                {isOpen && (
                    <div style={{
                        width: '100%',
                        height: '2px',
                        background: 'transparent',
                        borderBottom: '1px solid #e0e0e0',
                        boxShadow: '0px 2px 4px 0px #534DAF33',
                        margin: 0,
                    }} />
                )}
                <div
                    ref={el => (contentRefs.current[serviceNum] = el)}
                    className="transition-all duration-700 ease-in-out overflow-hidden"
                    style={{
                        maxHeight: isOpen ? '2000px' : '0px',
                        opacity: isOpen ? 1 : 0
                    }}
                >
                    {/* Option pills and sub-options go here (already styled in previous step) */}
                    {/* Special QR/message for Start a Business, now in the option area */}
                    {isStartBusiness && isOpen ? (
                        <div className="flex flex-col items-center justify-center" style={{
                            width: '100%',
                            minHeight: '115px',
                            borderBottomRightRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            paddingTop: '32px',
                            paddingBottom: '32px',
                            paddingLeft: '24px',
                            paddingRight: '24px',
                            background: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                        }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="Dummy QR" width={180} height={180} className="rounded-lg shadow-lg" />
                            <div className="text-lg font-semibold text-gray-700 mt-4 text-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '20px', lineHeight: '24px' }}>Download the app to continue.</div>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow mt-4"
                                onClick={() => {
                                    setStartBusinessDone(prev => ({ ...prev, [serviceNum]: true }));
                                    setOpenServiceNum(null);
                                }}
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                        <div className="flex flex-row flex-wrap items-center" style={{
                            width: '100%',
                            minHeight: '115px',
                            gap: '10px',
                            rowGap: '10px',
                            borderBottomRightRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            paddingTop: '32px',
                            paddingBottom: '32px',
                            paddingLeft: '24px',
                            paddingRight: '24px',
                            background: '#fff',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                        }}>
                            {configService.subcategories && configService.subcategories.map((sub, i) => {
                                const isSelected = (selectionPaths[serviceNum] || [])[0] === i;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSelect(serviceNum, 0, i)}
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
                                        {sub.label}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Sub-options row, if any */}
                        {(() => {
                            const options = configService.subcategories || [];
                            let subOptions = [];
                            let selectedOptionIdx = path[0];
                            if (typeof selectedOptionIdx === 'number' && options[selectedOptionIdx] && options[selectedOptionIdx].subcategories) {
                                subOptions = options[selectedOptionIdx].subcategories;
                            }
                            if (subOptions.length > 0) {
                                return (
                                    <div className="flex flex-row flex-wrap items-center" style={{
                                        width: '100%',
                                        minHeight: '70px',
                                        gap: '10px',
                                        rowGap: '10px',
                                        borderBottomRightRadius: '12px',
                                        borderBottomLeftRadius: '12px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        paddingLeft: '24px',
                                        paddingRight: '24px',
                                        background: '#fff',
                                        flexWrap: 'wrap',
                                        alignItems: 'flex-start',
                                    }}>
                                        {subOptions.map((sub, subIdx) => {
                                            const isSelected = (selectionPaths[serviceNum] || [])[1] === subIdx;
                                            return (
                                                <button
                                                    key={subIdx}
                                                    type="button"
                                                    onClick={() => handleSelect(serviceNum, 1, subIdx)}
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
                                                    {sub.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            }
                            return null;
                        })()}
                        </>
                    )}
                </div>
            </div>
        );
    };

    const handleSubserviceSelection = (subservice) => {
        if (selectedSubservices.includes(subservice)) {
            setSelectedSubservices(selectedSubservices.filter(item => item !== subservice));
        } else {
            setSelectedSubservices([...selectedSubservices, subservice]);
        }
    };

    const handleComplete = () => {
        // Prevent continue if no additional services selected
        if (getSubserviceOptions().length > 0 && selectedSubservices.length === 0) {
            toast.error('Please select the additional services to continue.');
            return;
        }
        // Prevent continue if not all main service details are filled
        const selectedCount = selectedServices.length;
        const detailsCount = (formState.serviceDetails || []).length;
        if (detailsCount < selectedCount) {
            toast.error('Please select details for all your chosen services to continue.');
            return;
        }
        // Update the form state with selected subservices
        updateField('subservices', selectedSubservices);

        // Mark the "Additional Services" step as complete
        try {
            // Calculate status values at the time of continue
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
            const userLoggedIn = !!user && !!user.email;
            const proposalSent = !!formState.proposalSent;
            // Create a status array for the sidebar
            const statusArray = [
                allBasicDetailsFilled,
                allAdditionalInfoFilled,
                false, // Preview not viewed yet
                false, // Share Your Details should NOT be marked complete here
                proposalSent
            ];
            if (setStepStatus && typeof setStepStatus === 'function') {
                setStepStatus(statusArray);
            }
        } catch (error) {
            console.warn("Error updating sidebar status:", error.message);
        }

        // Call the onComplete callback if provided
        if (onComplete) {
            onComplete();
        }
    };

    // Generate subservice options based on the selected services
    const getSubserviceOptions = () => {
        const options = [];

        if (formState.selectedServices.includes('Accounting')) {
            options.push(
                { id: 'bookkeeping', name: 'Bookkeeping' },
                { id: 'financial-statements', name: 'Financial Statements' },
                { id: 'tax-preparation', name: 'Tax Preparation' }
            );
        }

        if (formState.selectedServices.includes('Advisory')) {
            options.push(
                { id: 'business-planning', name: 'Business Planning' },
                { id: 'financial-forecasting', name: 'Financial Forecasting' },
                { id: 'strategic-consulting', name: 'Strategic Consulting' }
            );
        }

        return options;
    };

    // Use ResizeObserver to handle dynamic content height changes
    useEffect(() => {
        // Fix for accordion content height calculation
        if (openServiceNum !== null && contentRefs.current[openServiceNum]) {
            const resizeObserver = new ResizeObserver(() => {
                if (contentRefs.current[openServiceNum]) {
                    const scrollHeight = contentRefs.current[openServiceNum].scrollHeight;
                    contentRefs.current[openServiceNum].style.maxHeight = `${scrollHeight}px`;
                }
            });

            resizeObserver.observe(contentRefs.current[openServiceNum]);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [openServiceNum, selectionPaths]);

    return (
        <OnboardingLayout>
            <div className='w-full max-w-6xl mx-auto flex flex-col items-center py-6 bg-transparent p-6 relative min-h-[70vh] font-poppins'>
                <div className="w-screen flex flex-col items-center justify-center" style={{ position: 'relative', left: '50%', right: '50%', transform: 'translateX(-35%)', maxWidth: '100vw' }}>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#222] font-poppins" style={{ fontWeight: 600, lineHeight: '1.2' }}>
                        Additional <span className="text-[#FF8000]">Services</span>
                    </h1>
                    <p className="text-base text-center text-gray-500 mb-6 font-poppins" style={{ fontWeight: 500, lineHeight: '1.5', maxWidth: '700px' }}>
                        Select any additional services you need
                    </p>
                </div>
                {/* Accordion only */}
                <div className="mb-12 w-full">
                    <div className="space-y-5 w-full">
                        {selectedServices.map(renderAccordion)}
                    </div>
                </div>

                {getSubserviceOptions().length > 0 && (
                    <div className="w-full mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 font-poppins">Additional Services</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {getSubserviceOptions().map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => handleSubserviceSelection(option.id)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center font-poppins ${selectedSubservices.includes(option.id)
                                        ? 'bg-[#FF8000]/5 border-[#FF8000]'
                                        : 'hover:bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <div className={`w-5 h-5 mr-3 rounded-full flex-shrink-0 ${selectedSubservices.includes(option.id)
                                        ? 'bg-[#FF8000]'
                                        : 'border-2 border-gray-300'
                                        } flex items-center justify-center`}>
                                        {selectedSubservices.includes(option.id) && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="font-medium">{option.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Button container with Figma specs */}
                <ButtonContainer
                    onBack={onBack}
                    onContinue={handleComplete}
                    continueLabel="Continue"
                />
            </div>
        </OnboardingLayout>
    );
};

// Wrap with HOC to safely use the sidebar context
const SubserviceStepWithSidebar = withSidebar(SubserviceStep);
export default SubserviceStepWithSidebar;

