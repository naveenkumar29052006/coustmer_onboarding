import React, { useState } from 'react';
import AboutYou from './AboutYou';
import Industry from './Industry';
import People from './People';
import Services from './Services';
import Valuation from './Valuation';
import { useFormContext } from '../context/FormContext';
import logo from '../assets/logo.svg';

function Main() {
  const [selectedStep, setSelectedStep] = useState(1);
  const [formValid, setFormValid] = useState(true);
  const { formData } = useFormContext();

  const steps = [
    { number: 1, title: "About You" },
    { number: 2, title: "Industry" },
    { number: 3, title: "Valuation" },
    { number: 4, title: "People" },
    { number: 5, title: "Services" },
  ];

  const renderStepComponent = () => {
    switch (selectedStep) {
      case 1:
        return <AboutYou formValid={formValid} />;
      case 2:
        return <Industry formValid={formValid} />;
      case 3:
        return <Valuation formValid={formValid} />;
      case 4:
        return <People formValid={formValid} />;
      case 5:
        return <Services formValid={formValid} />;
      default:
        return null;
    }
  };

  const validateCurrentStep = () => {
    switch (selectedStep) {
      case 1:
        return formData.aboutYou && formData.aboutYou.trim() !== "";
      case 2:
        return formData.industry && formData.industry.trim() !== "";
      case 3:
        return formData.valuation && formData.valuation.trim() !== "";
      case 4:
        return formData.people && formData.people.trim() !== "";
      case 5:
        return formData.services && formData.services.length > 0;
      default:
        return true;
    }
  };

  const handleNextStep = async () => {
    const isValid = validateCurrentStep();

    if (!isValid) {
      setFormValid(false);
      return;
    }

    setFormValid(true);

    if (selectedStep === steps.length) {
      // Final step - show authentication popup
      // setShowAuthPopup(true);
      return;
    }

    setSelectedStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (selectedStep > 1) {
      setFormValid(true);
      setSelectedStep(prev => prev - 1);
    }
  };

  const getStepTitle = () => {
    switch (selectedStep) {
      case 1: return "Areas of Responsibility";
      case 2: return "Nature of Business";
      case 3: return "Business Financial Overview";
      case 4: return "Number of Employees";
      case 5: return "Preferred Services";
      default: return "";
    }
  };

  return (
    <div className='w-screen min-h-screen bg-transparent flex flex-col justify-center items-center p-0 relative'>
      {/* Two backdrop images - each covering half of the page */}
      <div className="fixed left-0 top-0 w-1/2 h-full z-0"
        style={{
          backgroundImage: 'url("/backdrop.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }}>
      </div>
      <div className="fixed right-0 top-0 w-1/2 h-full z-0"
        style={{
          backgroundImage: 'url("/backdrop.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }}>
      </div>

      {/* <div className="fixed left-0 top-0 h-screen w-auto z-10 flex justify-center items-center"> */}
      <div className="fixed w-full h-screen bg-transparent overflow-hidden flex justify-left items-center">
        <div className="absolute w-[30vw] h-[100vh] overflow-hidden shadow shadow-neutral-200 flex flex-col justify-between bg-transparent">

          {/* Top container with justify-end */}
          <div className="flex justify-end">
            <div className="w-[200px] h-[250px] bg-orange-300 opacity-40 blur-3xl" />
          </div>

          {/* Bottom container with justify-start */}
          <div className="flex justify-start">
            <div className="w-[200px] h-[250px] bg-orange-300 opacity-40 blur-3xl" />
          </div>
        </div>

        {/* Logo wrapper with hover animation */}
        <div className="absolute z-10 w-[30vw] h-[80vh] flex justify-center items-center">
          <div className="w-70 h-70 bg-neutral-400/10 backdrop-blur-md rounded-full backdrop-saturate-100 backdrop-contrast-100 flex justify-center items-center shadow-lg shadow-neutral-400/20
                  transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:backdrop-blur-lg">

            <div className="w-60 h-60 bg-white rounded-full flex justify-center items-center">
              <img src={logo} alt="Logo" className="w-50 h-50 object-contain" />
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* Main content wrapper */}
      <div className='w-full max-w-6xl flex justify-end items-center min-h-screen z-10 pr-6 md:pr-10'>
        <div className='w-full md:w-2/3 flex flex-col items-center gap-6 py-6 bg-transparent p-6 relative min-h-[70vh]'>
          {/* Content area */}
          <div className="w-full mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {getStepTitle()}
              <span className="text-[#FF8000]"> ({selectedStep}/5)</span>
            </h2>
          </div>

          {/* Form component - with overflow handling */}
          <div className="w-full overflow-y-auto pb-24">
            {renderStepComponent()}
          </div>

          {/* Navigation - absolute positioned at fixed distance from bottom */}
          <div className='w-full absolute bottom-6 left-0 right-0 px-6 z-20'>
            <div className='w-full bg-transparent py-4 rounded-lg border border-gray-200/30'>
              <div className='flex justify-between items-center'>
                <button
                  onClick={handlePrevious}
                  className='bg-[#F2F2F2] text-[#534DAF] px-6 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={selectedStep === 1}
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array(5).fill(0).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full ${idx < selectedStep ? "bg-[#FF8000]" : "bg-gray-300"}`}
                    ></div>
                  ))}
                </div>

                <button
                  onClick={handleNextStep}
                  className='bg-[#534DAF] text-white px-6 py-2 rounded-md cursor-pointer hover:bg-[#4A449E]'
                >
                  {selectedStep === 5 ? 'Complete' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;