import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";

const AuthPopup = ({ onClose, onRegister }) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const { completeStep } = useSidebar();
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber] = useState("");

    // Get sidebar context for marking step complete
    let setStepStatus;
    try {
        const sidebarContext = useSidebar();
        if (sidebarContext && sidebarContext.setStepStatus) {
            setStepStatus = sidebarContext.setStepStatus;
        }
    } catch (error) {
        console.warn("SidebarContext not available in AuthPopup:", error.message);
    }

    const validateForm = () => {
        if (!email.trim()) {
            setError("Email is required");
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Email address is invalid");
            return false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            setError("Phone number must be exactly 10 digits");
            return false;
        }
        setError("");
        return true;
    };

    // Handle form submit - mark step as complete
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Store submission timestamp in sessionStorage
        sessionStorage.setItem('userInfoSubmittedAt', Date.now().toString());

        try {
            // Mark "Share Your Details" step as complete ONLY when form is submitted
            if (setStepStatus) {
                const statusArray = [true, true, true, true, false]; // First 4 steps complete, proposal not sent yet
                setStepStatus(statusArray);
            }

            const phone = `${countryCode}${phoneNumber}`;

            if (typeof onRegister === 'function') {
                await onRegister({
                    email,
                    name,
                    phone,
                    companyWebsite
                });
            } else {
                login({ email, name: email.split('@')[0] });
                onClose();
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    const preventPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{overflow: 'hidden', position: 'fixed'}}>
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg p-4 w-full max-w-xs mx-auto relative" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                {/* Close button inside the card, top-right, with space above heading */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white hover:text-red-300 transition-colors"
                    style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        zIndex: 10
                    }}
                >
                    ✕
                </button>
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white drop-shadow-md">
                        User Information
                    </h2>
                    <div className="w-16 h-1 bg-[#FF8000] mx-auto mt-2 rounded-full shadow-lg"></div>
                    <p className="text-cyan-100 mt-2 font-medium">
                        Enter your details to continue
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/50 backdrop-blur-sm border border-red-500/50 text-white font-medium px-4 py-3 rounded-lg mb-4 shadow-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-[#FF8000] focus:outline-none focus:ring-1 focus:ring-[#FF8000] shadow-inner"
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={countryCode}
                            onChange={e => setCountryCode(e.target.value)}
                            maxLength={4}
                            className="w-16 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-2 py-3 text-white placeholder-white/60 focus:border-[#FF8000] focus:outline-none focus:ring-1 focus:ring-[#FF8000] shadow-inner"
                            placeholder="+91"
                        />
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                            maxLength={10}
                            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-[#FF8000] focus:outline-none focus:ring-1 focus:ring-[#FF8000] shadow-inner"
                            placeholder="10-digit number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 
                            text-white placeholder-white/60 focus:border-[#FF8000] focus:outline-none 
                            focus:ring-1 focus:ring-[#FF8000] shadow-inner"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#FF8000] to-[#FFA64D] hover:from-[#e67300] hover:to-[#ff9933] 
                        text-white py-3 rounded-lg transition-all duration-300 font-bold text-lg shadow-lg mt-4 
                        border border-white/10"
                    >
                        Save & Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPopup;