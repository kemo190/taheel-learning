const dictionaries = {
  ar: () => import("./ar.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

export const getDictionary = async (locale) => {
  // Fallback to 'ar' if locale is undefined or invalid
  const loadDict = dictionaries[locale] || dictionaries.ar;
  return loadDict();
};
