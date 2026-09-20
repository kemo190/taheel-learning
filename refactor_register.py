import re

with open('src/components/auth/RegisterForm.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update form outer class
content = content.replace(
    'className="flex flex-col gap-4"',
    'className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 w-full max-w-[800px] mx-auto mt-6"'
)

# 2. Update all inputs to flat style
# We need to change:
# bg-slate-50/50 -> bg-white
# rounded-2xl -> rounded-xl
# remove shadow-sm
# py-3.5 px-12 -> py-3 px-4 (since icons are removed)
# remove <div className="absolute top-1/2 ... icon ...></div>
# Move labels from <label className="sr-only"> to above the input
# Remove the <div className="relative"> wrappers around inputs

# We will use regex to find and replace the generic pattern for name and email
pattern_input = re.compile(r'<div>\s*<div className="relative">\s*<input\s+id="([^"]+)"\s+\{\.\.\.register\("([^"]+)"\)\}\s+type="([^"]+)"\s+placeholder=\{([^}]+)\}\s+className=\{`w-full bg-slate-50/50 border \$\{errors\.[^\?]+\? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-\[\#0b2646\] focus:ring-\[\#0b2646\]"\} rounded-2xl py-3\.5 px-12 text-\[15px\] focus:outline-none focus:ring-1 transition-all placeholder:text-slate-400 rtl:text-right ltr:text-left shadow-sm`\}\s+dir=\{isRtl \? "rtl" : "ltr"\}\s*/>\s*<label htmlFor="[^"]+" className="sr-only">\s*\{[^}]+\}\s*</label>\s*<div className="absolute top-1/2 [^>]+>\s*<[A-Za-z]+Icon />\s*</div>\s*</div>\s*\{errors\.[^\&]+&&\s*\(\s*<p className="text-red-500 text-xs mt-1\.5 px-2 font-medium">\s*\{errors\.[^\}]+\.message\}\s*</p>\s*\)\}\s*</div>', re.DOTALL)

def replace_input(match):
    id_val = match.group(1)
    name_val = match.group(2)
    type_val = match.group(3)
    placeholder_val = match.group(4)
    
    return f"""<div>
          <label htmlFor="{id_val}" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {{{placeholder_val}}}
          </label>
          <input
            id="{id_val}"
            {{...register("{name_val}")}}
            type="{type_val}"
            className={{`w-full bg-white border ${{errors.{name_val} ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"}} rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent rtl:text-right ltr:text-left`}}
            dir={{isRtl ? "rtl" : "ltr"}}
          />
          {{errors.{name_val} && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {{errors.{name_val}.message}}
            </p>
          )}}
        </div>"""

content = pattern_input.sub(replace_input, content)

# 3. Update Gender
pattern_gender = re.compile(r'<div className="w-full sm:w-1/2 flex flex-col">\s*<div className="relative">\s*<select\s+id="gender"\s+\{\.\.\.register\("gender"\)\}\s+className=\{`w-full appearance-none bg-slate-50/50 border \$\{errors\.gender \? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-\[\#0b2646\] focus:ring-\[\#0b2646\]"\} rounded-2xl py-3\.5 px-12 text-\[15px\] focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left shadow-sm cursor-pointer \$\{watch\("gender"\) \? "text-gray-900" : "text-gray-400"\}`\}\s+dir=\{isRtl \? "rtl" : "ltr"\}\s*>\s*<option value="" disabled>\s*\{dict\.auth\.gender\}\s*</option>\s*<option value="male">\{dict\.auth\.genders\.male\}</option>\s*<option value="female">\{dict\.auth\.genders\.female\}</option>\s*</select>\s*<label htmlFor="gender" className="sr-only">\s*\{dict\.auth\.gender\}\s*</label>\s*<div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">\s*<GenderIcon />\s*</div>\s*<div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-\[\#0b2646\] pointer-events-none">\s*<ChevronDownIcon />\s*</div>\s*</div>\s*\{errors\.gender && \(\s*<p className="text-red-500 text-xs mt-1\.5 px-2 font-medium">\s*\{errors\.gender\.message\}\s*</p>\s*\)\}\s*</div>', re.DOTALL)

def replace_gender(match):
    return """<div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
              {dict.auth.gender}
            </label>
            <div className="relative">
              <select
                id="gender"
                {...register("gender")}
                className={`w-full appearance-none bg-white border ${errors.gender ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch("gender") ? "text-gray-900" : "text-gray-400"}`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <option value="" disabled>
                  {dict.auth.gender}
                </option>
                <option value="male">{dict.auth.genders.male}</option>
                <option value="female">{dict.auth.genders.female}</option>
              </select>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
                {errors.gender.message}
              </p>
            )}
          </div>"""

content = pattern_gender.sub(replace_gender, content)

# 4. Update Phone
# We just replace the wrappers and the label
pattern_phone = re.compile(r'<div className="w-full sm:w-1/2 flex flex-col">\s*<Controller', re.DOTALL)
content = content.replace('<div className="w-full sm:w-1/2 flex flex-col">\n            <Controller', '<div>\n            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">{dict.auth.phone}</label>\n            <Controller')

content = content.replace('bg-[#f8f9fb] border ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl px-4 py-1 focus-within:border-[#0b2646] transition-all h-[46px]', 'bg-white border ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl px-4 py-1.5 focus-within:border-[#0b2646] transition-all')
content = content.replace('placeholder: dict.auth.phone,', 'placeholder: dict.auth.phone,\n                      id: "phone",')

# Remove the flex wrappers for the two-column rows
content = content.replace('<!-- Gender & Phone -->', '')
content = content.replace('<div className="flex flex-col sm:flex-row gap-4">', '')
content = content.replace('<!-- Country & Governorate -->', '')

# We will need to just replace the whole string to ensure valid JSX.
with open('src/components/auth/RegisterForm.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
