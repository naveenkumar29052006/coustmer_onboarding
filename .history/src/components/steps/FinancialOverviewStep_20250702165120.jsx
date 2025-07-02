import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";

const valuationRanges = [
    "Yet to begin",
    "Under 1 Crore",
    "1-10 Crore",
    "10-50 Crore",
    "50-100 Crore",
    "Above 100 Crore",
    "All of the above",
];

const currencies = [
    { symbol: "₹", name: "INR" },
    { symbol: "€", name: "EUR" },
    { symbol: "$", name: "USD" },
];

const FinancialOverviewStep = ({ onAboveAllOfThis }) => {
    const { formState, updateField } = useOnboarding();
    const selectedRange = formState.valuationRange || "";
    const selectedCurrency = formState.currency || "INR";

    const handleSelect = (range) => {
        updateField("valuationRange", range);

        // If "Yet to begin" is selected, set employeeCount to a default value
        if (range === "Yet to begin") {
            updateField("employeeCount", "0-10");
        }
        // If 'All of the above' is selected, trigger special navigation
        if (range === "All of the above" && typeof onAboveAllOfThis === 'function') {
            onAboveAllOfThis();
        }
    };

    const handleCurrencySelect = (currency) => {
        updateField("currency", currency);
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-row items-center gap-4 mb-6">
                <p className="text-sm text-neutral-600 font-medium mb-0">
                    Choose Currency:
                </p>
                {currencies.map((curr) => (
                    <button
                        key={curr.name}
                        onClick={() => handleCurrencySelect(curr.name)}
                        className={`h-[35px] rounded-full text-sm transition-all flex items-center justify-center text-center px-1 gap-1 ${selectedCurrency === curr.name
                            ? "bg-[#FF8000] text-white"
                            : "bg-transparent border border-gray-400 text-gray-700 hover:border-[#FF8000] hover:text-[#FF8000]"
                            }`}
                        style={{ width: "65px" }}
                    >
                        <div className={`w-[25px] h-[25px] rounded-full flex items-center justify-center px-3`} 
                            style={{
                                background: selectedCurrency === curr.name ? 'var(--Primary-White, #FFFFFF)' : 'var(--Background-Notice-Neutral, #FFF3E6)',
                            }}
                        >
                            <span className="text-sm font-medium" style={{ color: 'var(--Background-Notice, #FF8000)' }}>{curr.symbol}</span>
                        </div>
                        <span className="text-xs">{curr.name}</span>
                    </button>
                ))}
            </div>

            <p className="text-sm text-neutral-600 font-medium">
                Choose the valuation range that best reflects your business.
            </p>

            <div className="flex flex-wrap gap-4 w-full">
                {valuationRanges.map((range) => (
                    <button
                        key={range}
                        onClick={() => handleSelect(range)}
                        className={`px-5 py-3 rounded-full text-sm transition-all flex justify-center items-center text-center ${selectedRange === range
                            ? "bg-[#FF8000] text-white"
                            : "bg-transparent border border-gray-400 text-gray-700 hover:border-[#FF8000] hover:text-[#FF8000]"
                            }`}
                    >
                        {range}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FinancialOverviewStep;
