import React, { createContext, useContext, useState, useEffect } from "react";

const initialFormData = {
  aboutYou: "",
  industry: "",
  valuation: "",
  people: "",
  services: []
};

const FormContext = createContext(null);

export const FormProvider = ({ children }) => {
  // Clear any form data that might be stored on initial load
  useEffect(() => {
    localStorage.removeItem('formData');
  }, []);

  const [formData, setFormData] = useState(initialFormData);

  const updateFormSection = (section, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: value
    }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormSection }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};