import React, { useState, useRef } from 'react';
import AreaOfResponsibilityStep from './steps/AreaOfResponsibilityStep';
import BusinessCategoryStep from './steps/BusinessCategoryStep';
import FinancialOverviewStep from './steps/FinancialOverviewStep';
import EmployeeCountStep from './steps/EmployeeCountStep';
import ServicesStep from './steps/ServicesStep';
import logo from '../assets/logo.svg';

const steps = [
  { title: 'Areas of Responsibility', component: <AreaOfResponsibilityStep /> },
  { title: 'Nature of Business', component: <BusinessCategoryStep /> },
  { title: 'Business Financial Overview', component: <FinancialOverviewStep /> },
  { title: 'Number of Employees', component: <EmployeeCountStep /> },
  { title: 'Preferred Services', component: <ServicesStep /> },
];

const HomePage = ({ onContinueToAdditionalInfo }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const handleAccordionClick = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleContinue = () => {
    if (onContinueToAdditionalInfo) {
      onContinueToAdditionalInfo();
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left: 30% white with logo */}
      <div className="w-[30%] min-w-[220px] bg-transparent flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src={logo} alt="logo" className="h-28 w-auto mb-4" style={{ filter: 'drop-shadow(0 2px 16px #f3e3d1)' }} />
        </div>
      </div>
      {/* Right: 70% with backdrop and onboarding content */}
      <div
        className="w-[70%] flex flex-col items-center justify-center min-h-screen p-0"
        style={{
          backgroundImage: 'url(/backdrop.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-2xl flex flex-col items-center justify-center px-8 py-12">
          <h1 className="text-2xl font-bold mb-2 text-center">
            Welcome to Our <span className="text-[#FF8000]">Service</span> Portal
          </h1>
          <p className="mb-6 text-gray-600 text-center">Answer a few quick questions, and we'll guide you through the next steps.</p>
          <div className="space-y-4 mb-6 w-full">
            {steps.map((step, idx) => (
              <div key={step.title} className="border rounded-lg overflow-hidden transition-shadow" style={{ background: 'var(--Background-Primary, #FFFFFF)' }}>
                <button
                  className="w-full flex justify-between items-center p-4 text-base font-medium focus:outline-none bg-transparent"
                  onClick={() => handleAccordionClick(idx)}
                  style={{ transition: 'background 0.2s' }}
                >
                  <span className="inline-block rounded-full border-2 border-[#FF8000] bg-transparent mr-3" style={{ width: 32, height: 32 }}></span>
                  <span>{step.title}</span>
                  <span>{openIndex === idx ? '-' : '+'}</span>
                </button>
                <div
                  ref={el => (contentRefs.current[idx] = el)}
                  style={{
                    maxHeight: openIndex === idx ? (contentRefs.current[idx]?.scrollHeight || 500) : 0,
                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    background: 'rgba(248,250,252,0.7)',
                  }}
                >
                  {openIndex === idx && (
                    <div className="p-4 border-t">{step.component}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            className="w-full py-3 bg-[#534DAF] text-white rounded-md font-semibold text-base hover:bg-[#423a9c] transition"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;