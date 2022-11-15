import { useRouter } from 'next/router';
import en from './locales/en';
import ua from './locales/ua';
import ru from './locales/ru';

export function useLocale () {
   const router = useRouter();
   const {locale, locales, defaultLocale} = router;

      let lang = ( locale ? locales!.find(lang=>locale.startsWith(lang)) : defaultLocale);
      return getLangFile(lang!);
}

export function getLangFile(lang: string){
   switch (lang){
      case 'en': return en;
      case 'uk': return en;
      case 'ua': return ua;
      case 'ru': return ru;
      default: return en;
   }
}
