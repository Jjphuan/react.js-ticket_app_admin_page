import LocalizedStrings from "react-localization";
import { zh } from "./lang/zh";
import { en } from "./lang/en";

let strings = new LocalizedStrings({
  en: en,
  zh: zh,
});

strings.setLanguage(localStorage.getItem('language') || 'en')

export default strings;