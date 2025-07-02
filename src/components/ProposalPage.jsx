import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import { useAuth } from "../context/AuthContext";
import OnboardingLayout from './OnboardingLayout';
import AuthPopup from "./AuthPopup";
import { useSidebar } from '../context/SidebarContext';

import { toast } from 'react-hot-toast';
import servicesConfig from './servicesConfig';

import PdfGenerator from "./PdfGenerator";


const ProposalPage = ({ onComplete, onBack }) => {
    const { formState, setProposalSent } = useOnboarding();
    const { user, login } = useAuth();
    const [showAuthPopup, setShowAuthPopup] = useState(true); // Always show initially
    const [pendingAction, setPendingAction] = useState(null); // 'email' or 'phone'
    const { completeStep } = useSidebar();


    // Update DB whenever user, selectedServices, or serviceDetails change
    useEffect(() => {
        if (user && user.id && formState.selectedServices) {
            // Update selected services
            fetch(`http://localhost:3001/api/auth/users/${user.id}/services`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ services: formState.selectedServices.join(',') })
            })
                .then(res => res.json())
                .catch(() => { });

            // Update service details if available
            if (formState.serviceDetails && formState.serviceDetails.length > 0) {
                fetch(`http://localhost:3001/api/auth/users/${user.id}/service-details`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ service_details: formState.serviceDetails })
                })
                    .then(res => res.json())
                    .catch(() => { });
            }
        }
    }, [user, formState.selectedServices, formState.serviceDetails]);

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

    const stepStatus = [
        allBasicDetailsFilled,
        allAdditionalInfoFilled,
        true, // Preview viewed is true when we reach the proposal page
        userLoggedIn,
        proposalSent
    ];

    // Check sessionStorage for user info submission timestamp - with proper dependencies
    useEffect(() => {
        const submittedAt = sessionStorage.getItem('userInfoSubmittedAt');
        if (submittedAt) {
            // User has submitted the form, mark "Share Your Details" as completed
            // Only call completeStep once by checking if step 3 is not already complete
            if (!stepStatus[3]) {
                completeStep(3);
            }
        }
    }, [completeStep]); // Remove stepStatus from dependencies to prevent loop

    // Get sidebar context for marking step complete
    let setStepStatus;
    try {
        const sidebarContext = useSidebar();
        if (sidebarContext && sidebarContext.setStepStatus) {
            setStepStatus = sidebarContext.setStepStatus;
        }
    } catch (error) {
        console.warn("SidebarContext not available in ProposalPage:", error.message);
    }

    // Memoize the PDF component to prevent re-renders
    const memoizedPdfGenerator = useMemo(() =>
        <PdfGenerator formState={formState} />,
        [formState?.serviceDetails] // Only depend on serviceDetails to prevent unnecessary re-renders
    );

    // Memoize handlers to prevent unnecessary re-renders
    const handleSendToEmail = useCallback(async () => {
        if (user?.email) {
            // Send email directly if user is logged in
            try {
                const response = await fetch('http://localhost:3001/api/email/send-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ to: user.email })
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    toast.success('📧 Proposal sent to your email!');
                    setProposalSent(true);

                    // Mark final step as complete
                    if (setStepStatus) {
                        const statusArray = [true, true, true, true, true];
                        setStepStatus(statusArray);
                    }

                    if (onComplete) {
                        onComplete('pdf');
                    }
                } else {
                    toast.error(data.message || '❌ Failed to send email');
                }
            } catch {
                toast.error('❌ Failed to send email');
            }
        } else {
            // If user not logged in, show error message but DON'T show popup
            toast.error('❌ Please complete the form first to send proposal via email');
        }
    }, [user, setStepStatus, onComplete, setProposalSent]);

    const handleSendToPhone = useCallback(async () => {
        if (user?.phone) {
            // Send SMS directly if user has phone
            try {
                const response = await fetch('http://localhost:3001/api/email/send-sms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ to: user.phone, message: 'Your proposal is ready! Please check your dashboard or contact us for details.' })
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    toast.success('📱 Proposal sent via SMS!');

                    // Mark final step as complete
                    if (setStepStatus) {
                        const statusArray = [true, true, true, true, true];
                        setStepStatus(statusArray);
                    }

                    if (onComplete) {
                        onComplete('pdf');
                    }
                } else {
                    toast.error(data.message || '❌ Failed to send SMS');
                }
            } catch {
                toast.error('❌ Failed to send SMS');
            }
        } else {
            // If user doesn't have phone, show error message but DON'T show popup
            toast.error('❌ Please complete the form first to send proposal via SMS');
        }
    }, [user, setStepStatus, onComplete, setProposalSent]);

    const handleRegisterAndSend = useCallback(async (userInfo) => {
        // Collect all onboarding info from formState and userInfo
        const payload = {
            email: userInfo.email,
            name: userInfo.name,
            phone: userInfo.phone,
            company: userInfo.company,
            company_website: userInfo.companyWebsite,
            selected_services: formState.selectedServices && Array.isArray(formState.selectedServices)
                ? formState.selectedServices.map(num => {
                    const config = servicesConfig[num - 1];
                    return config ? config.label : num;
                }).join(',') : '',
            service_details: formState.serviceDetails || []
        };
        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                const userData = {
                    id: data.user?.id || data.id || null,
                    email: userInfo.email,
                    name: userInfo.name || userInfo.email.split('@')[0],
                    phone: userInfo.phone || null,
                    company: userInfo.company || null
                };

                login(userData);
                toast.success('User details saved. You can now preview and send the proposal!');
                setShowAuthPopup(false); // Hide popup after successful registration
                sessionStorage.setItem('userInfoSubmittedAt', Date.now().toString());

                setPendingAction(null);
            } else {
                toast.error(data.message || '❌ Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            toast.error('❌ Registration failed. Please try again.');
        }
    }, [formState, login]);

    // Check if user is logged in to hide popup
    useEffect(() => {
        // Only hide AuthPopup if user is logged in AND has submitted details recently
        const submittedAt = sessionStorage.getItem('userInfoSubmittedAt');
        if (user?.email && submittedAt) {
            setShowAuthPopup(false);
        } else if (!user?.email) {
            // Only show popup if user is not logged in
            setShowAuthPopup(true);
        }
    }, [user]);

    return (
        <OnboardingLayout stepStatus={stepStatus}>
            <div className='w-full max-w-5xl mx-auto flex flex-col items-center py-6 pb-12 bg-transparent p-6 relative min-h-[70vh] font-poppins'>
                {/* Main heading with the second word in orange */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#222] font-poppins" style={{ fontWeight: 600, lineHeight: '1.2' }}>
                    Service <span className="text-[#FF8000]">Proposal</span>
                </h1>
                <p className="text-base text-center text-gray-500 mb-6 font-poppins" style={{ fontWeight: 500, lineHeight: '1.5', maxWidth: '700px' }}>
                    Here's a proposal tailored to your selections.
                </p>

                <div className="w-full flex flex-col items-center justify-center relative">
                    {/* PDF Preview Container */}
                    <div
                        className="bg-transparent rounded-lg shadow-xl relative overflow-hidden"
                        style={{
                            maxWidth: '1000px',
                            width: '100%',
                            height: '660px',
                            maxHeight: 'calc(100vh - 180px)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* PDF Generator - always render but may be overlaid */}
                        {memoizedPdfGenerator}

                        {/* AuthPopup Overlay - positioned absolutely over the PDF */}
                        {showAuthPopup && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center"
                                style={{
                                    background: `
                                        radial-gradient(ellipse at top left, rgba(255, 128, 0, 0.15) 0%, transparent 50%),
                                        radial-gradient(ellipse at bottom right, rgba(255, 128, 0, 0.1) 0%, transparent 50%),
                                        rgba(0, 0, 0, 0.4)
                                    `,
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    overflow: 'hidden'
                                }}
                            >
                                <AuthPopup
                                    onClose={() => {
                                            setShowAuthPopup(false);
                                            setPendingAction(null);
                                    }}
                                    onRegister={handleRegisterAndSend}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom buttons - Only show when AuthPopup is hidden */}
                {!showAuthPopup && (
                    <div className="mt-6 w-full">
                        <div className="btn-container-proposal">
                            {/* Previous Button - Left Side */}
                            <button
                                onClick={onBack}
                                className="btn-secondary"
                                style={{ width: '188px', height: '48px' }}
                            >
                                <svg className="btn-icon-left" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5" stroke="#FF8000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 19L5 12L12 5" stroke="#FF8000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Previous
                            </button>

                            {/* Right Side Group - Via Number and Via E-Mail */}
                            <div className="btn-group-right">
                                <button
                                    onClick={handleSendToPhone}
                                    className="btn-via-number"
                                >
                                    <svg className="btn-icon-left" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.33331 2.00001C3.33331 1.63334 3.63331 1.33334 3.99998 1.33334H5.99998C6.33331 1.33334 6.63998 1.57334 6.69998 1.90001L7.26665 4.56667C7.28665 4.69284 7.26192 4.82251 7.19665 4.93334C7.13138 5.04417 7.02968 5.13001 6.90665 5.17334L5.07998 5.82667C5.87998 7.77334 7.56665 9.44667 9.51331 10.26L10.1666 8.43334C10.21 8.31034 10.2958 8.20868 10.4066 8.14341C10.5175 8.07814 10.6471 8.05341 10.7733 8.07334L13.44 8.64001C13.7666 8.70001 14.0066 8.99334 14.0066 9.33334V11.3333C14.0066 11.7 13.7066 12 13.34 12C6.79998 12 1.33331 6.54001 1.33331 0.00001C1.33331 -0.36666 1.63331 -0.66666 1.99998 -0.66666H3.99998C4.33331 -0.66666 4.63331 -0.42666 4.69331 -0.09999L5.25998 2.56667C5.27998 2.69284 5.25525 2.82251 5.18998 2.93334C5.12471 3.04417 5.02301 3.13001 4.89998 3.17334L3.07331 3.82667C3.22665 4.30001 3.46665 4.80667 3.75331 5.32667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Via Number
                                </button>

                                <button
                                    onClick={handleSendToEmail}
                                    className="btn-via-email"
                                >
                                    <svg className="btn-icon-left" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.66668 2.66667H13.3333C14.0667 2.66667 14.6667 3.26667 14.6667 4.00001V12C14.6667 12.7333 14.0667 13.3333 13.3333 13.3333H2.66668C1.93335 13.3333 1.33335 12.7333 1.33335 12V4.00001C1.33335 3.26667 1.93335 2.66667 2.66668 2.66667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14.6667 4L8.00001 8.66667L1.33334 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Via E-Mail
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </OnboardingLayout>
    );
};

export default ProposalPage;