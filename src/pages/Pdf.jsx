import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { useAuth } from '../context/AuthContext';
import PdfGenerator from '../components/PdfGenerator';

export default function Pdf() {
    const { formState } = useOnboarding();
    const { user } = useAuth();
    const [status, setStatus] = useState(null);
    const [sending, setSending] = useState(false);
    const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
    const [sendingSMS, setSendingSMS] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPhoneInput, setShowPhoneInput] = useState(false);

    // Email send handler
    const handleSendEmail = async () => {
        if (!user?.email) {
            setStatus({
                type: 'error',
                message: 'Please log in to send the PDF.'
            });
            return;
        }
        setSending(true);
        setStatus(null);
        try {
            const res = await fetch('http://localhost:3001/api/email/send-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: user.email
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus({
                    type: 'success',
                    message: `PDF sent successfully to ${data.recipient}`
                });
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Failed to send email'
                });
            }
        } catch (err) {
            console.error('Send email error:', err);
            setStatus({
                type: 'error',
                message: err.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setSending(false);
        }
    };

    // WhatsApp send handler
    const handleSendWhatsApp = async () => {
        if (!user?.email) {
            setStatus({
                type: 'error',
                message: 'Please log in to send the PDF.'
            });
            return;
        }
        if (!phoneNumber) {
            setShowPhoneInput(true);
            return;
        }
        setSendingWhatsApp(true);
        setStatus(null);
        try {
            const res = await fetch('http://localhost:3001/api/email/send-whatsapp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: phoneNumber,
                    message: `Hello! Here's your requested PDF document. You can view it at: ${window.location.origin}/book.pdf`
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus({
                    type: 'success',
                    message: 'WhatsApp message sent successfully!'
                });
                setShowPhoneInput(false);
                setPhoneNumber("");
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Failed to send WhatsApp message'
                });
            }
        } catch (err) {
            console.error('Send WhatsApp error:', err);
            setStatus({
                type: 'error',
                message: err.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setSendingWhatsApp(false);
        }
    };

    // SMS send handler
    const handleSendSMS = async () => {
        if (!user?.email) {
            setStatus({
                type: 'error',
                message: 'Please log in to send the PDF.'
            });
            return;
        }
        if (!phoneNumber) {
            setShowPhoneInput(true);
            return;
        }
        setSendingSMS(true);
        setStatus(null);
        try {
            const res = await fetch('http://localhost:3001/api/email/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: phoneNumber,
                    message: `Hello! Here's your requested PDF document. You can view it at: ${window.location.origin}/book.pdf`
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus({
                    type: 'success',
                    message: 'SMS sent successfully!'
                });
                setShowPhoneInput(false);
                setPhoneNumber("");
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Failed to send SMS'
                });
            }
        } catch (err) {
            console.error('Send SMS error:', err);
            setStatus({
                type: 'error',
                message: err.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setSendingSMS(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 py-6 space-y-4">
            {/* PDF Generator */}
            <PdfGenerator formState={formState} user={user} />

            {/* Communication Sender */}
            <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        {user?.email ? `Logged in as: ${user.email}` : 'Not logged in'}
                    </p>
                    {status && (
                        <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>
                    )}
                </div>
                {showPhoneInput && (
                    <div className="flex flex-col items-center space-y-2">
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1234567890"
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8000]"
                        />
                        <p className="text-xs text-gray-500">Enter phone number with country code</p>
                    </div>
                )}
                <div className="flex gap-4 flex-wrap justify-center">
                    <button
                        onClick={handleSendEmail}
                        disabled={sending || !user?.email}
                        className={`px-6 py-2 rounded font-medium ${sending || !user?.email ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF8000] hover:bg-[#e67300] text-white'}`}
                    >
                        {sending ? 'Sending...' : 'Send PDF to Email'}
                    </button>
                    <button
                        onClick={handleSendWhatsApp}
                        disabled={sendingWhatsApp || !user?.email}
                        className={`px-6 py-2 rounded font-medium ${sendingWhatsApp || !user?.email ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                        {sendingWhatsApp ? 'Sending...' : 'Send to WhatsApp'}
                    </button>
                    <button
                        onClick={handleSendSMS}
                        disabled={sendingSMS || !user?.email}
                        className={`px-6 py-2 rounded font-medium ${sendingSMS || !user?.email ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                        {sendingSMS ? 'Sending...' : 'Send as SMS'}
                    </button>
                </div>
            </div>
        </div>
    );
}
