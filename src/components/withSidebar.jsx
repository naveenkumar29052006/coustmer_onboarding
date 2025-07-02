import React from 'react';
import { useSidebar } from '../context/SidebarContext';

// Higher-Order Component to safely wrap components that need to use the sidebar context
const withSidebar = (WrappedComponent) => {
    // Return a component that attempts to use the sidebar context safely
    return (props) => {
        try {
            // Try to use the sidebar context
            const sidebarContext = useSidebar();

            // If we got here, the sidebar context is available
            return <WrappedComponent {...props} {...sidebarContext} />;
        } catch (error) {
            console.warn("SidebarContext not available in withSidebar:", error.message);

            // Create mock sidebar functions
            const mockSidebarProps = {
                stepStatus: [false, false, false, false, false],
                setStepStatus: () => { },
                updateStepStatus: () => { },
                completeStep: () => { },
                getActiveStep: () => 0,
                currentStep: 0
            };

            // Render the component with mock sidebar props
            return <WrappedComponent {...props} {...mockSidebarProps} />;
        }
    };
};

export default withSidebar;