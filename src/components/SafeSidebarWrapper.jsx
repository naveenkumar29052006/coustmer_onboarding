import React, { useEffect } from 'react';
import { useSidebar } from '../context/SidebarContext';

// This component safely handles the sidebar integration
const SafeSidebarWrapper = ({ children, stepStatus }) => {
    // Using a flag to check if we're in a sidebar context
    let sidebarAvailable = true;
    let updateAllStepStatus;

    try {
        const sidebarContext = useSidebar();
        updateAllStepStatus = sidebarContext.updateAllStepStatus;
    } catch (error) {
        console.warn("SidebarContext not available:", error.message);
        sidebarAvailable = false;
    }

    useEffect(() => {
        if (sidebarAvailable && stepStatus && Array.isArray(stepStatus) && updateAllStepStatus) {
            updateAllStepStatus(stepStatus);
        }
    }, [stepStatus, updateAllStepStatus, sidebarAvailable]);

    return <>{children}</>;
};

export default SafeSidebarWrapper;