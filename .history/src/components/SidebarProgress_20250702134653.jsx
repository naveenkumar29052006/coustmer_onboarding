import React from 'react';
import { FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const SidebarProgress = ({ steps, stepSVGs, stepStatus, activeStepIndex }) => {
  const stepToView = [
    'home',           // Basic Details
    'subservice',     // Additional Services
    'shareDetails',   // Share Your Details
    'proposal',       // Preview
    'proposal',       // Proposal
  ];

  return (
    <div
      className="hidden md:flex flex-col justify-between items-center h-screen fixed left-0 top-0 bottom-0 bg-transparent p-0 z-20"
      style={{
        width: '250px',
        minWidth: '250px',
        maxWidth: '250px',
        background: `
          radial-gradient(ellipse at 80% 20%, #ffe5c2 0%, #fff8f1 60%, transparent 100%),
          radial-gradient(ellipse at 20% 80%, #ffe5c2 0%, #fff8f1 60%, transparent 100%),
          #fff
        `,
        boxShadow: '4px 0px 15px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Logo at top */}
      <div className="w-full flex flex-col items-center pt-4 pb-2">
        <img src="/advit2.png" alt="Advith Consulting" className="w-40 h-auto mb-2" />
      </div>
      {/* Progress bar */}
      <div className="w-full flex flex-col items-center gap-0 px-8 mt-0 mb-2">
        <div className="flex flex-col gap-0 w-full">
          {steps.map((title, idx) => {
            const isActive = idx === activeStepIndex;
            const isCompleted = stepStatus[idx];
            return (
              <React.Fragment key={title}>
                <div className="flex items-center gap-3 mb-2 transition-all duration-300 hover:translate-x-1"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('sidebar-step-click', { detail: { view: stepToView[idx] } }));
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`rounded-full flex items-center justify-center relative transition-all duration-500 p-0`}
                    style={{
                      width: 32,
                      height: 32,
                      minWidth: 32,
                      minHeight: 32,
                      maxWidth: 32,
                      maxHeight: 32,
                      aspectRatio: '1/1',
                      background: isCompleted
                        ? 'var(--Content-Positive, #009933)'
                        : isActive
                          ? 'var(--Background-Notice, #FF8000)'
                          : 'transparent',
                      border: isCompleted ? 'none' : isActive ? '2px solid #fff' : '2px solid #e5e7eb',
                      boxSizing: 'border-box',
                      flexShrink: 0
                    }}
                  >
                    {isCompleted ? (
                      <span style={{ width: '28px', height: '28px', background: 'var(--Content-Positive, #009933)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                          <path d="M2 5.5L6 9L12 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    ) : isActive ? (
                      <span style={{ width: '28px', height: '28px', background: 'var(--Background-Notice, #FF8000)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {/* White border overlay for SVG */}
                        <span style={{
                          position: 'absolute',
                          top: 2,
                          left: 2,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '2px solid #fff',
                          pointerEvents: 'none',
                          boxSizing: 'border-box',
                          zIndex: 1
                        }} />
                        <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {stepSVGs[idx] && React.cloneElement(stepSVGs[idx], { stroke: '#fff' })}
                        </span>
                      </span>
                    ) : (
                      stepSVGs[idx]
                    )}
                  </div>
                  <div className={`text-sm font-semibold transition-colors duration-300 whitespace-nowrap`} style={{ color: (isCompleted || isActive) ? 'var(--Content-Secondary, #333333)' : (idx < activeStepIndex ? '#333333' : '#888'), maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {title}
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-7 border-l-2 ml-4 transition-all duration-500 ${isCompleted ? 'border-green-400' : 'border-orange-100'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* Social media icons at bottom */}
      <div className="w-full flex flex-row justify-center items-center gap-4 pb-8">
        <a href="https://www.instagram.com/advithitec/?hl=en" target="_blank" rel="noopener noreferrer" className="text-[#E4405F] hover:scale-110 transition"><FaInstagram size={22} /></a>
        <a href="https://www.linkedin.com/company/advith-itec-private-limited?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className="text-[#0077B5] hover:scale-110 transition"><FaLinkedin size={22} /></a>
        <a href="https://x.com/advithitec?lang=en" target="_blank" rel="noopener noreferrer" className="text-black hover:scale-110 transition"><FaXTwitter size={22} /></a>
        <a href="https://www.youtube.com/@advithitecprivatelimited9001" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] hover:scale-110 transition"><FaYoutube size={22} /></a>
      </div>
    </div>
  );
};

export default SidebarProgress; 