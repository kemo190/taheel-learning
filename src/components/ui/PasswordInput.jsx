"use client";
import { useState, forwardRef } from 'react';

const PasswordInput = forwardRef(({ placeholder, isRtl, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  // SVG Icons
  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
      <line x1="2" x2="22" y1="2" y2="22"></line>
    </svg>
  );

  return (
    <div className="relative">
      <input 
        ref={ref}
        type={showPassword ? "text" : "password"} 
        placeholder={placeholder}
        className="w-full bg-[#f8f9fb] border border-gray-200 rounded-xl py-3 px-12 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left"
        dir={isRtl ? 'rtl' : 'ltr'}
        {...props}
      />
      {/* Lock icon on the START edge (Right in RTL, Left in LTR) */}
      <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
        <LockIcon />
      </div>
      {/* Eye icon on the END edge (Left in RTL, Right in LTR) */}
      <button 
        type="button" 
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 hover:text-[#0b2646] transition-colors cursor-pointer"
        aria-label={isRtl ? (showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور") : (showPassword ? "Hide password" : "Show password")}
        aria-pressed={showPassword}
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;

