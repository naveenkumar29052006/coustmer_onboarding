import React, { useState } from 'react';
import { OnboardingProvider } from './context/OnboardingContext';
import { FormProvider } from './context/FormContext';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import ProposalPage from './components/ProposalPage';
import Pdf from './pages/Pdf';
import UserListPage from './components/UserListPage';
import SubserviceStep from './components/steps/SubserviceStep';
import OnboardingContainer from './components/OnboardingContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPopup from './components/AuthPopup';
import { Toaster } from 'react-hot-toast';
import ServiceSummary from './components/ServiceSummary';

const Navbar = ({ setCurrentView }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-4">
      <button
        onClick={() => setCurrentView('home')}
        className="px-5 py-2 bg-[#FF8000] text-white rounded-lg shadow-md hover:bg-[#e66f00] transition-colors font-semibold"
      >
        Home
      </button>
      <button
        onClick={() => setCurrentView('userlist')}
        className="px-5 py-2 bg-[#534DAF] text-white rounded-lg shadow-md hover:bg-[#423a9c] transition-colors font-semibold"
      >
        User List
      </button>
    </div>
  );
};

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  // Function to render the correct component based on currentView
  const renderView = () => {
    switch (currentView) {
      case 'proposal':
        return <ProposalPage onComplete={() => { }} />; // Don't show AuthPopup
      case 'pdf':
        return <Pdf />;
      case 'userlist':
        return <UserListPage />;
      default:
        // Always render OnboardingContainer for onboarding flow
        return <OnboardingContainer onComplete={() => { }} />;
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AuthProvider>
        <OnboardingProvider>
          <FormProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-white relative">
                <Navbar setCurrentView={setCurrentView} />
                {renderView()}
                {/* Remove this AuthPopup */}
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div>
            </SidebarProvider>
          </FormProvider>
        </OnboardingProvider>
      </AuthProvider>
    </>
  );
}

export default App;