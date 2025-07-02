import React, { useState } from 'react';
import toast from 'react-hot-toast';
import SidebarProgress from './SidebarProgress';

// --- Custom two-step sidebar for Share Details page ---
const shareSteps = [
  'Basic Details',
  'Share Your Details',
];
const shareStepSVGs = [
  // Step 1 SVG
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.33329 1.33331H3.99996C3.64634 1.33331 3.3072 1.47379 3.05715 1.72384C2.8071 1.97389 2.66663 2.31302 2.66663 2.66665V13.3333C2.66663 13.6869 2.8071 14.0261 3.05715 14.2761C3.3072 14.5262 3.64634 14.6666 3.99996 14.6666H12C12.3536 14.6666 12.6927 14.5262 12.9428 14.2761C13.1928 14.0261 13.3333 13.6869 13.3333 13.3333V5.33331M9.33329 1.33331L13.3333 5.33331M9.33329 1.33331L9.33331 5.33331H13.3333M10.6666 8.66663H5.33331M10.6666 11.3333H5.33331M6.66664 5.99997H5.33331" stroke="#333333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Step 2 SVG
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3333 14V12.6667C13.3333 11.9594 13.0523 11.2811 12.5522 10.781C12.0521 10.281 11.3739 10 10.6666 10H5.33329C4.62605 10 3.94777 10.281 3.44767 10.781C2.94758 11.2811 2.66663 11.9594 2.66663 12.6667V14M10.6666 4.66667C10.6666 6.13943 9.47272 7.33333 7.99996 7.33333C6.5272 7.33333 5.33329 6.13943 5.33329 4.66667C5.33329 3.19391 6.5272 2 7.99996 2C9.47272 2 10.6666 3.19391 10.6666 4.66667Z" stroke="#333333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
];

function ShareSidebar({ stepStatus }) {
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
      <div className="w-full flex flex-col items-center pt-4 pb-2">
        <img src="/advit2.png" alt="Advith Consulting" className="w-40 h-auto mb-2" />
      </div>
      <div className="w-full flex flex-col items-center gap-0 px-8 mt-0 mb-2">
        <div className="flex flex-col gap-0 w-full">
          {shareSteps.map((step, idx) => {
            const isActive = stepStatus[idx] === false && stepStatus.slice(0, idx).every(Boolean);
            const isCompleted = stepStatus[idx];
            return (
              <React.Fragment key={step.label}>
                <div className="flex items-center gap-3 mb-2 transition-all duration-300 hover:translate-x-1">
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
                      <span style={{ width: '28px', height: '28px', background: 'var(--Background-Notice, #FF8000)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {React.cloneElement(step.icon, { stroke: '#fff' })}
                      </span>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className={`text-sm font-semibold transition-colors duration-300 whitespace-nowrap`} style={{ color: (isCompleted || isActive) ? 'var(--Content-Secondary, #333333)' : '#888', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {step.label}
                  </div>
                </div>
                {idx < shareSteps.length - 1 && (
                  <div
                    className={`h-7 border-l-2 ml-4 transition-all duration-500 ${isCompleted ? 'border-green-400' : 'border-orange-100'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-row justify-center items-center gap-4 pb-8">
        {/* Social icons if needed */}
      </div>
    </div>
  );
}
// --- End custom sidebar ---

const ShareDetailsPage = ({ onPrevious }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  // Step status: [basic details complete, share details complete]
  const [stepStatus, setStepStatus] = useState([true, false]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    if (!/^[+][0-9]{1,4}$/.test(countryCode)) {
      toast.error('Invalid country code');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email address');
      return;
    }
    setLoading(true);
    try {
      const fullPhone = `${countryCode}${phone}`;
      const payload = { name, phone: fullPhone, email };
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Details submitted successfully!');
        setName('');
        setPhone('');
        setEmail('');
        setStepStatus([true, true]); // Mark both steps complete
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent flex flex-col md:flex-row justify-center items-stretch p-0 relative overflow-x-hidden">
      {/* Sidebar */}
      <SidebarProgress
        steps={shareSteps}
        stepSVGs={shareStepSVGs}
        stepStatus={stepStatus}
        activeStepIndex={stepStatus.findIndex(s => !s)}
      />
      {/* Main content */}
      <div className='flex flex-col items-center justify-center min-h-screen w-full z-10 px-2 md:pl-[20px] md:ml-[220px] md:px-0'
        style={{
          maxWidth: '100%',
          backgroundImage: "url('/back.png')",
          backgroundSize: '400px 400px',
          backgroundRepeat: 'repeat',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="container mx-auto flex flex-col items-center justify-center" style={{ maxWidth: '100%', width: '100%' }}>
          <h1 
            className="mb-2 text-center"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              letterSpacing: '0.01em',
              textAlign: 'center',
              verticalAlign: 'middle',
              color: '#222',
            }}
          >
            Share your <span style={{ color: '#FF8000' }}>Details</span>
          </h1>
          <p 
            className="mb-8 text-center max-w-xl"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              letterSpacing: '0.01em',
              textAlign: 'center',
              verticalAlign: 'middle',
              color: '#444',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            You've selected a custom set of services. Our team will review your details and get in touch soon.
          </p>
          <form className="w-full max-w-xl flex flex-col items-center justify-center" style={{ gap: '12px', marginLeft: 'auto', marginRight: 'auto' }} onSubmit={handleSubmit}>
            <div className="relative flex items-center w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3327 14V12.6667C13.3327 11.9594 13.0517 11.2811 12.5516 10.781C12.0515 10.281 11.3733 10 10.666 10H5.33268C4.62544 10 3.94716 10.281 3.44706 10.781C2.94697 11.2811 2.66602 11.9594 2.66602 12.6667V14M10.666 4.66667C10.666 6.13943 9.47213 7.33333 7.99937 7.33333C6.52661 7.33333 5.3327 6.13943 5.3327 4.66667C5.3327 3.19391 6.52661 2 7.99937 2C9.47213 2 10.666 3.19391 10.666 4.66667Z" stroke="#666666" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="text"
                className="pl-12 pr-5 text-lg focus:outline-none shadow-sm w-full"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={loading}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '1rem',
                  lineHeight: '1.5rem',
                  letterSpacing: '0.01em',
                  verticalAlign: 'middle',
                  background: 'var(--Background-Primary, #FFFFFF)',
                  border: 'none',
                  boxShadow: '0px 2px 8px 0px #534DAF14',
                  width: '700px',
                  height: '72px',
                  borderRadius: '8px',
                }}
              />
            </div>
            <div className="relative flex items-center w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1661_2553)">
                    <path d="M14.6669 11.2807V13.2807C14.6677 13.4664 14.6297 13.6502 14.5553 13.8203C14.4809 13.9904 14.3718 14.1431 14.235 14.2686C14.0982 14.3941 13.9367 14.4897 13.7608 14.5492C13.5849 14.6087 13.3985 14.6308 13.2136 14.614C11.1622 14.3911 9.19161 13.6901 7.46028 12.5674C5.8495 11.5438 4.48384 10.1782 3.46028 8.56738C2.3336 6.82819 1.63244 4.84804 1.41361 2.78738C1.39695 2.60303 1.41886 2.41722 1.47795 2.2418C1.53703 2.06637 1.63199 1.90518 1.75679 1.76846C1.88159 1.63175 2.03348 1.52252 2.20281 1.44773C2.37213 1.37294 2.55517 1.33422 2.74028 1.33405H4.74028C5.06382 1.33086 5.37748 1.44543 5.62279 1.6564C5.8681 1.86737 6.02833 2.16035 6.07361 2.48072C6.15803 3.12076 6.31458 3.7492 6.54028 4.35405C6.62998 4.59266 6.64939 4.85199 6.59622 5.1013C6.54305 5.35061 6.41952 5.57946 6.24028 5.76072L5.39361 6.60738C6.34265 8.27641 7.72458 9.65834 9.39361 10.6074L10.2403 9.76072C10.4215 9.58147 10.6504 9.45795 10.8997 9.40478C11.149 9.35161 11.4083 9.37102 11.6469 9.46071C12.2518 9.68641 12.8802 9.84297 13.5203 9.92738C13.8441 9.97307 14.1399 10.1362 14.3513 10.3857C14.5627 10.6352 14.6751 10.9538 14.6669 11.2807Z" stroke="#666666" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1661_2553">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <input
                type="text"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value.replace(/[^+0-9]/g, '').slice(0, 4))}
                disabled={loading}
                style={{
                  width: '60px',
                  height: '72px',
                  border: 'none',
                  borderRadius: '8px 0 0 8px',
                  background: 'var(--Background-Primary, #FFFFFF)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '1rem',
                  lineHeight: '1.5rem',
                  letterSpacing: '0.01em',
                  textAlign: 'center',
                  boxShadow: '0px 2px 8px 0px #534DAF14',
                  marginRight: '-1px',
                  zIndex: 2,
                }}
                maxLength={4}
                placeholder="+91"
              />
              <input
                type="text"
                className="pr-5 text-lg focus:outline-none shadow-sm w-full"
                placeholder="Enter Your number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                maxLength={10}
                disabled={loading}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '1rem',
                  lineHeight: '1.5rem',
                  letterSpacing: '0.01em',
                  verticalAlign: 'middle',
                  background: 'var(--Background-Primary, #FFFFFF)',
                  border: 'none',
                  boxShadow: '0px 2px 8px 0px #534DAF14',
                  width: '640px',
                  height: '72px',
                  borderRadius: '0 8px 8px 0',
                  marginLeft: '-1px',
                  zIndex: 1,
                  paddingLeft: '16px',
                }}
              />
            </div>
            <div className="relative flex items-center w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.6673 1.99935C14.6673 1.26602 14.0673 0.666016 13.334 0.666016H2.66732C1.93398 0.666016 1.33398 1.26602 1.33398 1.99935M14.6673 1.99935V9.99935C14.6673 10.7327 14.0673 11.3327 13.334 11.3327H2.66732C1.93398 11.3327 1.33398 10.7327 1.33398 9.99935V1.99935M14.6673 1.99935L8.00065 6.66602L1.33398 1.99935" stroke="#666666" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="email"
                className="pl-12 pr-5 text-lg focus:outline-none shadow-sm w-full"
                placeholder="Enter your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 400,
                  fontSize: '1rem',
                  lineHeight: '1.5rem',
                  letterSpacing: '0.01em',
                  verticalAlign: 'middle',
                  background: 'var(--Background-Primary, #FFFFFF)',
                  border: 'none',
                  boxShadow: '0px 2px 8px 0px #534DAF14',
                  width: '700px',
                  height: '72px',
                  borderRadius: '8px',
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white py-4 rounded-lg transition-all duration-300 shadow-lg mt-2 border border-white/10"
              style={{
                background: 'var(--Background-Notice, #FF8000)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '1.125rem',
                lineHeight: '1.75rem',
                letterSpacing: '0.01em',
                verticalAlign: 'middle',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          <button
            className="w-full max-w-xl mt-6 border-2 border-[#FF8000] text-[#FF8000] py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#FFF3E0] transition"
            onClick={onPrevious || (() => window.history.back())}
            disabled={loading}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              letterSpacing: '0.01em',
              verticalAlign: 'middle',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="#FF8000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 19L5 12L12 5" stroke="#FF8000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDetailsPage; 