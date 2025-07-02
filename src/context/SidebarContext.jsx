import React, { createContext, useState, useContext, useCallback } from 'react';

// Create context
const SidebarContext = createContext();

// Create provider component
export const SidebarProvider = ({ children }) => {
  // Five steps: Basic Details, Additional Services, Preview, Share Your Details, Proposal
  const [stepStatus, setStepStatus] = useState([false, false, false, false, false]);
  const [currentStep, setCurrentStep] = useState(0);

  // Function to update a specific step status
  const updateStepStatus = useCallback((stepIndex, status) => {
    setStepStatus(prevStatus => {
      const newStatus = [...prevStatus];
      // Only update if the value has actually changed
      if (newStatus[stepIndex] !== status) {
        newStatus[stepIndex] = status;
        return newStatus;
      }
      return prevStatus;
    });
  }, []);

  // Function to explicitly mark a step as completed after user clicks continue
  const completeStep = useCallback((stepIndex) => {
    setStepStatus(prevStatus => {
      const newStatus = [...prevStatus];
      // Only update if the value has actually changed
      if (newStatus[stepIndex] !== true) {
        newStatus[stepIndex] = true;
        return newStatus;
      }
      return prevStatus;
    });

    // Move to next step if we completed the current one
    setCurrentStep(prevCurrentStep => {
      if (prevCurrentStep === stepIndex) {
        return stepIndex + 1;
      }
      return prevCurrentStep;
    });
  }, []);

  // Function to get the active step index (first uncompleted step)
  const getActiveStep = useCallback(() => {
    const index = stepStatus.findIndex(status => !status);
    return index === -1 ? stepStatus.length - 1 : index;
  }, [stepStatus]);

  return (
    <SidebarContext.Provider
      value={{
        stepStatus,
        setStepStatus,
        updateStepStatus,
        currentStep,
        setCurrentStep,
        completeStep,
        getActiveStep
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};