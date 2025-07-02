import React from 'react';
import OnboardingLayout from './OnboardingLayout';

const figmaSteps = [
  'Basic Details',
  'Share Your details',
  'Special Figma Step',
];

const FigmaSpecialStep = ({ onBack }) => {
  return (
    <div className="w-full min-h-screen flex flex-row">
      {/* Sidebar */}
      <div className="w-[22vw] min-w-[180px] max-w-[220px] h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#fff8f1] to-[#ffe5c2] shadow-md p-0">
        <div className="w-full flex flex-col items-center pt-4 pb-2">
          <img src="/advit2.png" alt="Advith Consulting" className="w-40 h-auto mb-2" />
        </div>
        <div className="flex flex-col gap-8 mt-8 w-full px-6">
          {figmaSteps.map((step, idx) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${idx === 2 ? 'border-[#FF8000]' : 'border-green-500'} ${idx < 2 ? 'bg-green-500' : 'bg-white'}`}>
                {idx < 2 ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="9" fill="#22C55E" />
                    <path d="M5 9l2.5 2.5L13 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="w-4 h-4 bg-[#FF8000] rounded-full block"></span>
                )}
              </div>
              <span className={`font-semibold text-base ${idx === 2 ? 'text-[#FF8000]' : 'text-gray-800'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-12">
        <h1 className="text-4xl font-bold mb-4 text-[#FF8000]">Special Figma Page</h1>
        <p className="text-lg text-gray-700 mb-8">This is a placeholder for the Figma-matching content. Replace with your actual design and logic.</p>
        <button
          className="btn-secondary mt-4"
          onClick={onBack}
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default FigmaSpecialStep; 