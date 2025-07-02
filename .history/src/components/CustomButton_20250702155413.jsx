import React from 'react';

/**
 * CustomButton Component
 * 
 * A reusable button component following the Figma design guidelines
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant: "continue", "previous", "generate"
 * @param {string} props.label - Button text
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.showLeftIcon - Whether to show left icon
 * @param {boolean} props.showRightIcon - Whether to show right icon
 */
const CustomButton = ({
    variant = "continue",
    label,
    onClick,
    showLeftIcon = false,
    showRightIcon = false,
    className = "",
    ...props
}) => {
    // Base styles for all buttons
    const baseStyles = "font-poppins font-semibold text-lg focus:outline-none transition-all duration-300";

    // Variant-specific styles
    const variantStyles = {
        continue: `bg-[#FF8000] text-white py-3 px-16 h-[52px] w-[193px] rounded-[4px] shadow-[0px_0px_12px_0px_#00000014] hover:shadow-[0px_16px_32px_0px_#0000001A]`,

        previous: `border border-[#FF8000] text-[#FF8000] bg-transparent py-3 px-16 h-[48px] w-[188px] rounded-[4px] hover:bg-[#FFF8F3]`,

        generate: `bg-[#FF8000] text-white py-3 px-16 h-[48px] w-[260px] rounded-[4px] hover:bg-[#e67300] gap-2.5`,
    };

    // Left arrow icon for previous button
    const LeftArrowIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    // Custom icon for generate proposal button
    const CustomGenerateIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 15C12.8747 15 15 12.949 15 8C15 12.949 17.1104 15 22 15C17.1104 15 15 17.1104 15 22C15 17.1104 12.8747 15 8 15Z" stroke="#333333" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 6.5C5.13376 6.5 6.5 5.18153 6.5 2C6.5 5.18153 7.85669 6.5 11 6.5C7.85669 6.5 6.5 7.85669 6.5 11C6.5 7.85669 5.13376 6.5 2 6.5Z" stroke="#333333" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
    );

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className} flex items-center justify-center`}
            {...props}
        >
            {showLeftIcon && variant === "previous" && <LeftArrowIcon className="mr-2" />}
            <span className="whitespace-nowrap">{label}</span>
            {showRightIcon && variant === "generate" && (
                <span className="ml-2" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 15C12.8747 15 15 12.949 15 8C15 12.949 17.1104 15 22 15C17.1104 15 15 17.1104 15 22C15 17.1104 12.8747 15 8 15Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M2 6.5C5.13376 6.5 6.5 5.18153 6.5 2C6.5 5.18153 7.85669 6.5 11 6.5C7.85669 6.5 6.5 7.85669 6.5 11C6.5 7.85669 5.13376 6.5 2 6.5Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </span>
            )}
        </button>
    );
};

export default CustomButton;