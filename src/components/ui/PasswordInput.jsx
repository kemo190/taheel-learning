"use client";
import { useState, forwardRef } from "react";
import { LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

const PasswordInput = forwardRef(({ placeholder, isRtl, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full bg-[#f8f9fb] border border-gray-200 rounded-xl py-3 px-12 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left"
        dir={isRtl ? "rtl" : "ltr"}
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
        aria-label={
          isRtl
            ? showPassword
              ? "إخفاء كلمة المرور"
              : "إظهار كلمة المرور"
            : showPassword
              ? "Hide password"
              : "Show password"
        }
        aria-pressed={showPassword}
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
