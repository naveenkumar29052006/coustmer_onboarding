import React from 'react';
import CustomButton from './CustomButton';

/**
 * ButtonContainer Component
 * 
 * Container for navigation buttons with proper spacing according to Figma design
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Handler for back/previous button
 * @param {Function} props.onContinue - Handler for continue button
 * @param {string} props.continueLabel - Custom label for continue button (default: "Continue")
 * @param {boolean} props.showGenerateButton - Show Generate Proposal button instead of Continue
 */
const ButtonContainer = ({
    onBack,
    onContinue,
    continueLabel = "Continue",
    showGenerateButton = false,
    className = ""
}) => {
    return (
        <div className={`w-full max-w-[1000px] h-12 flex flex-row justify-between items-center gap-4 my-4 ${className}`} style={{flexWrap: 'nowrap'}}>
            <CustomButton
                variant="previous"
                label="Previous"
                onClick={onBack}
                showLeftIcon={true}
            />

            {showGenerateButton ? (
                <CustomButton
                    variant="generate"
                    label="Generate Proposal"
                    onClick={onContinue}
                    showRightIcon={true}
                />
            ) : (
                <CustomButton
                    variant="continue"
                    label={continueLabel}
                    onClick={onContinue}
                />
            )}
        </div>
    );
};

export default ButtonContainer;