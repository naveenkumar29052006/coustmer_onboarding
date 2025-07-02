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
        <OnboardingLayout>
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-6 bg-transparent p-6 relative min-h-[70vh] font-poppins">
                <div className="w-full flex flex-col items-center justify-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#222] font-poppins" style={{ fontWeight: 600, lineHeight: '1.2' }}>
                        Proposal <span className="text-[#FF8000]">Page</span>
                    </h1>
                    <p className="text-base text-center text-gray-500 mb-6 font-poppins" style={{ fontWeight: 500, lineHeight: '1.5', maxWidth: '700px' }}>
                        Here is your proposal summary and options to send it.
                    </p>
                </div>
                {/* PDF and send options */}
                <div className="w-full flex flex-col items-center justify-center">
                    {memoizedPdfGenerator}
                    {/* Add send to email/phone buttons here if needed */}
                </div>
                {/* Button container or other actions */}
            </div>
        </OnboardingLayout>
    );
};

export default ProposalPage;