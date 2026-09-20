import re

with open('src/components/auth/RegisterForm.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add governorates list
governorates_data = """const governorates = ["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Sharkia", "Menoufia", "Gharbia", "Beheira", "Faiyum", "Beni Suef", "Minya", "Asyut", "Suhag", "Qena", "Aswan", "Luxor"];"""
content = re.sub(r'// ----------------------------------------------------------------------\n// DATA\n// ----------------------------------------------------------------------', f'// ----------------------------------------------------------------------\n// DATA\n// ----------------------------------------------------------------------\n{governorates_data}\n', content)

# 2. Add validation schema
content = re.sub(r'(phone: z.*?\}\),)', r'\1\n    governorate: z.string().min(1, { message: dict.auth.errors.required }),', content, flags=re.DOTALL)

# 3. Add defaultValues
content = re.sub(r'terms: false,', r'governorate: "",\n      terms: false,', content)

# 4. Add variable for statesList inside component
content = re.sub(r'const \[success, setSuccess\] = useState\(null\);', r'const [success, setSuccess] = useState(null);\n  const statesList = governorates;', content)

# 5. Fix Supabase payload
content = re.sub(r'governorate: "", // default or omitted', r'governorate: data.governorate,', content)

# 6. Insert Governorate UI Field and remove `md:col-span-2` from Phone
phone_ui = r'\{\/\* Phone \*\/\}.*?<\/div>'
governorate_ui = """
        {/* Governorate */}
        <div>
          <label htmlFor="governorate" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.governorate}
          </label>
          <div className="relative">
            <select
              id="governorate"
              {...register("governorate")}
              className={`w-full appearance-none bg-white border ${errors.governorate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch("governorate") ? "text-gray-900" : "text-gray-400"}`}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <option value="" disabled>
                {dict.auth.governorate}
              </option>
              {statesList.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
          {errors.governorate && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.governorate.message}
            </p>
          )}
        </div>"""

def replace_phone(match):
    original = match.group(0)
    # Remove md:col-span-2
    original = original.replace('className="md:col-span-2"', 'className=""')
    # Append Governorate
    return original + governorate_ui

content = re.sub(phone_ui, replace_phone, content, flags=re.DOTALL)

with open('src/components/auth/RegisterForm.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
