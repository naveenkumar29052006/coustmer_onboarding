import React from 'react';
import logo from '../assets/logo.svg';
import { FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { useSidebar } from '../context/SidebarContext';
import SidebarProgress from './SidebarProgress';

const steps = [
  'Basic Details',
  'Additional Services',
  'Preview',
  'Share Your Details',
  'Proposal',
];

const stepSVGs = [
  // Step 1 SVG
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.33329 1.33331H3.99996C3.64634 1.33331 3.3072 1.47379 3.05715 1.72384C2.8071 1.97389 2.66663 2.31302 2.66663 2.66665V13.3333C2.66663 13.6869 2.8071 14.0261 3.05715 14.2761C3.3072 14.5262 3.64634 14.6666 3.99996 14.6666H12C12.3536 14.6666 12.6927 14.5262 12.9428 14.2761C13.1928 14.0261 13.3333 13.6869 13.3333 13.3333V5.33331M9.33329 1.33331L13.3333 5.33331M9.33329 1.33331L9.33331 5.33331H13.3333M10.6666 8.66663H5.33331M10.6666 11.3333H5.33331M6.66664 5.99997H5.33331" stroke="#333333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Step 2 SVG
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.80003 4.19997C9.67787 4.32459 9.60945 4.49213 9.60945 4.66663C9.60945 4.84114 9.67787 5.00868 9.80003 5.1333L10.8667 6.19997C10.9913 6.32212 11.1589 6.39054 11.3334 6.39054C11.5079 6.39054 11.6754 6.32212 11.8 6.19997L14.3134 3.68663C14.6486 4.42743 14.7501 5.25279 14.6043 6.05273C14.4586 6.85267 14.0725 7.5892 13.4975 8.16415C12.9226 8.73911 12.1861 9.12519 11.3861 9.27094C10.5862 9.41669 9.76082 9.31519 9.02003 8.97997L4.41336 13.5866C4.14814 13.8519 3.78843 14.0008 3.41336 14.0008C3.03829 14.0008 2.67858 13.8519 2.41336 13.5866C2.14814 13.3214 1.99915 12.9617 1.99915 12.5866C1.99915 12.2116 2.14814 11.8519 2.41336 11.5866L7.02003 6.97997C6.6848 6.23917 6.5833 5.41381 6.72905 4.61387C6.87481 3.81393 7.26088 3.0774 7.83584 2.50245C8.4108 1.92749 9.14732 1.54141 9.94726 1.39566C10.7472 1.24991 11.5726 1.35141 12.3134 1.68663L9.80003 4.19997Z" stroke="#333333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Step 3 SVG
  (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <circle cx="11" cy="14" r="3"/>
      <line x1="16" y1="19" x2="13.5" y2="16.5"/>
    </svg>
  ),
  // Step 4 SVG
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3333 14V12.6667C13.3333 11.9594 13.0523 11.2811 12.5522 10.781C12.0521 10.281 11.3739 10 10.6666 10H5.33329C4.62605 10 3.94777 10.281 3.44767 10.781C2.94758 11.2811 2.66663 11.9594 2.66663 12.6667V14M10.6666 4.66667C10.6666 6.13943 9.47272 7.33333 7.99996 7.33333C6.5272 7.33333 5.33329 6.13943 5.33329 4.66667C5.33329 3.19391 6.5272 2 7.99996 2C9.47272 2 10.6666 3.19391 10.6666 4.66667Z" stroke="#333333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Step 5 SVG
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.66663 1.33331H3.99996C3.64634 1.33331 3.3072 1.47379 3.05715 1.72384C2.8071 1.97389 2.66663 2.31302 2.66663 2.66665V13.3333C2.66663 13.6869 2.8071 14.0261 3.05715 14.2761C3.3072 14.5262 3.64634 14.6666 3.99996 14.6666H12C12.3536 14.6666 12.6927 14.5262 12.9428 14.2761C13.1928 14.0261 13.3333 13.6869 13.3333 13.3333V5.99998M8.66663 1.33331L13.3333 5.99998M8.66663 1.33331L8.66663 5.99998L13.3333 5.99998" stroke="#333333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
];

const OnboardingLayout = ({ children, stepStatus: propStepStatus }) => {
  // Get state from context, with fallback to props
  let stepStatus = [false, false, false, false, false];
  let activeStepIndex = 0;

  try {
    const sidebarContext = useSidebar();
    if (sidebarContext) {
      // Use context values if available
      stepStatus = propStepStatus || sidebarContext.stepStatus;
      activeStepIndex = sidebarContext.getActiveStep ?
        sidebarContext.getActiveStep() :
        sidebarContext.currentStep;
    } else if (propStepStatus) {
      // If context not available but props are, use them
      stepStatus = propStepStatus;
      activeStepIndex = propStepStatus.findIndex(s => !s);
      if (activeStepIndex === -1) activeStepIndex = 0;
    }
  } catch (error) {
    console.warn("SidebarContext not available in OnboardingLayout:", error.message);
  }

  return (
    <div className='w-full min-h-screen bg-transparent flex flex-col md:flex-row justify-center items-stretch p-0 relative overflow-x-hidden'>
      {/* Left banner */}
      <SidebarProgress
        steps={steps}
        stepSVGs={stepSVGs}
        stepStatus={stepStatus}
        activeStepIndex={activeStepIndex}
      />
      {/* Main content */}
      <div className='flex flex-col items-start justify-center min-h-screen w-full z-10 px-2 md:px-0 md:pl-0'
        style={{
          maxWidth: '100%',
          backgroundImage: "url('/back.png')",
          backgroundSize: '400px 400px',
          backgroundRepeat: 'repeat',
          backgroundColor: '#000'
        }}
      >
        {children}
      </div>
      <style>{`
      @keyframes fadein-scale {
        0% { opacity: 0; transform: scale(0.5); }
        60% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 1; transform: scale(1); }
      }
      .animate-fadein-scale {
        animation: fadein-scale 0.7s cubic-bezier(0.4,0,0.2,1);
      }
      
      @keyframes ping {
        75%, 100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      .animate-ping {
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      
      @keyframes pulse-glow {
        0% { box-shadow: 0 0 0 0 rgba(255, 128, 0, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(255, 128, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 128, 0, 0); }
      }
      .animate-pulse-glow {
        animation: pulse-glow 2s infinite;
      }
      
      @keyframes pulse-subtle {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .animate-pulse-subtle {
        animation: pulse-subtle 1.5s ease-in-out infinite;
      }
      
      @keyframes slide-in-left {
        0% { transform: translateX(-10px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      .animate-slide-in-left {
        animation: slide-in-left 0.4s ease-out forwards;
      }
      
      @keyframes color-pulse {
        0% { color: rgba(251, 146, 60, 0.8); }
        50% { color: rgba(251, 146, 60, 1); }
        100% { color: rgba(251, 146, 60, 0.8); }
      }
      .animate-color-pulse {
        animation: color-pulse 2s infinite;
      }
    `}</style>
    </div>
  );
};

export default OnboardingLayout;
