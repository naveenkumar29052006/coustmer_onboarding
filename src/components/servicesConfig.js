// Dynamic config for all services and their subcategories
// Each service can have a label, value, and optional subcategories (array of { label, value })

const servicesConfig = [
  {
    label: "Zoho",
    value: "Zoho",
    subcategories: []
  },
  {
    label: "Finance Operation Automation",
    value: "Finance Operation Automation",
    subcategories: [
      { label: "DPA", value: "DPA" },
      {
        label: "CFO Stack – ITeC App",
        value: "CFO Stack – ITeC App",
        subcategories: [
          { label: "Financial Audit Readiness", value: "A" },
          { label: "Automation", value: "B" },
          { label: "Financial Due Diligence", value: "C" },
          { label: "Procure to Pay Automation", value: "D" },
          { label: "Litigation Tracker", value: "E" },
          { label: "Finance Project Management", value: "F" },
          { label: "Accounting, Payroll & Compliance", value: "G" }
        ]
      }
    ]
  },
  {
    label: "Payroll",
    value: "Payroll",
    subcategories: [
      { label: "End-to-end support", value: "1" },
      { label: "Need additional dedicated resources", value: "2" },
      { label: "Only review function", value: "3" }
    ]
  },
  {
    label: "Accounting",
    value: "Accounting",
    subcategories: [
      { label: "End-to-end support", value: "1" },
      { label: "Need additional dedicated resources", value: "2" },
      { label: "Only review function", value: "3" }
    ]
  },
  {
    label: "Compliances",
    value: "Compliances",
    subcategories: [
      { label: "End-to-end support", value: "1" },
      { label: "Need additional dedicated resources", value: "2" },
      { label: "Only review function", value: "3" }
    ]
  },
  {
    label: "Advisory Services",
    value: "Advisory Services",
    subcategories: [
      { label: "Due Diligence", value: "A" },
      { label: "Transfer Pricing", value: "B" },
      { label: "Other Advisory", value: "C" },
      { label: "Valuation", value: "D" },
      { label: "Fund Raise", value: "E" },
      { label: "Process Setup & Review", value: "F" },
      { label: "Family Settlement", value: "G" },
      { label: "IFC Testing / Internal Audit", value: "H" },
      { label: "Mergers & Acquisitions", value: "I" },
      { label: "ESOP Structuring", value: "J" },
      { label: "Schedule a discovery call", value: "K" }
    ]
  },
  {
    label: "Start a Business",
    value: "Start a Business",
    subcategories: [] // Prompt to download app, not a subcategory
  },
  {
    label: "Hire a CFO",
    value: "Hire a CFO",
    subcategories: []
  },
  {
    label: "Audit Support",
    value: "Audit Support",
    subcategories: []
  },
  {
    label: "People Augmentation",
    value: "People Augmentation",
    subcategories: []
  },
  {
    label: "HR Support",
    value: "HR Support",
    subcategories: []
  },
  {
    label: "Customer Support",
    value: "Customer Support",
    subcategories: []
  }
];
export default servicesConfig; 