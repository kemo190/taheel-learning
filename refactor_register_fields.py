import re

with open('src/components/auth/RegisterForm.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove gender, country, and governorate from Zod schema
content = re.sub(r'gender:\s*z\.string\(\)\.min\(1,\s*\{\s*message:\s*dict\.auth\.errors\.required\s*\}\),', '', content)
content = re.sub(r'country:\s*z\.string\(\)\.min\(1,\s*\{\s*message:\s*dict\.auth\.errors\.required\s*\}\),', '', content)
content = re.sub(r'governorate:\s*z\.string\(\)\.min\(1,\s*\{\s*message:\s*dict\.auth\.errors\.required\s*\}\),', '', content)

# 2. Update defaultValues in useForm
content = re.sub(r'country:\s*"",\s*governorate:\s*"",\s*gender:\s*"",', '', content)

# 3. Remove countries, governorates arrays, selectedCountry, countriesList, statesList
content = re.sub(r'const countries = \[.*?\];', '', content, flags=re.DOTALL)
content = re.sub(r'const governorates = \{.*?\};', '', content, flags=re.DOTALL)
content = re.sub(r'const selectedCountry = watch\("country"\);.*?\|\| \[\];', '', content, flags=re.DOTALL)

# 4. Update supabase payload
content = re.sub(r'gender:\s*data\.gender,', 'gender: "male", // default or omitted', content)
content = re.sub(r'country:\s*data\.country,', 'country: "EG", // default to Egypt', content)
content = re.sub(r'governorate:\s*data\.governorate,', 'governorate: "", // default or omitted', content)

# 5. Remove PhoneInput import
content = re.sub(r'import PhoneInput, \{ isSupportedCountry \} from "react-phone-number-input";\nimport "react-phone-number-input/style\.css";\n', '', content)

# 6. Replace the entire Phone field UI with a regular input
phone_replacement = """        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.phone}
          </label>
          <input
            id="phone"
            {...register("phone")}
            type="tel"
            className={`w-full bg-white border ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent rtl:text-right ltr:text-left`}
            dir="ltr"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>"""

content = re.sub(r'\{\/\*\s*Phone\s*\*\/\}.*?\{\/\*\s*Country\s*\*\/\}', phone_replacement + '\n\n        {/* Country */}', content, flags=re.DOTALL)

# 7. Remove Gender UI, Country UI, Governorate UI
content = re.sub(r'\{\/\*\s*Gender\s*\*\/\}.*?\{\/\*\s*Phone\s*\*\/\}', '{/* Phone */}', content, flags=re.DOTALL)
content = re.sub(r'\{\/\*\s*Country\s*\*\/\}.*?\{\/\*\s*Password\s*\*\/\}', '{/* Password */}', content, flags=re.DOTALL)

with open('src/components/auth/RegisterForm.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
