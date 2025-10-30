
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const I18nCtx = createContext(null);

const DICTS = {
  en: {
  "Login": "Login",
  "Registration": "Registration",
  "Email": "Email",
  "Password": "Password",
  "Remember me": "Remember me",
  "No account?": "No account?",
  "Create account": "Create account",
  "Already have an account?": "Already have an account?",
  "Logout": "Logout",
  "Profile": "Profile",
  "My Profile": "My Profile",
  "First name": "First name",
  "Last name": "Last name",
  "Phone": "Phone",
  "Save": "Save",
  "Saved!": "Saved!",
  "Submit": "Submit",
  "Submit Title": "Submit Title",
  "My Works": "My Works",
  "Notifications": "Notifications",
  "Professor": "Professor",
  "Student": "Student",
  "Register": "Register",
  "Open menu": "Open menu",
  "New password": "New password",
  "Search": "Search",
  "Search by title or authors": "Search by title or authors",
  "Create new Title": "Create new Title",
  "Edit": "Edit",
  "Edit title": "Edit title",
  "Delete": "Delete",
  "Authors:": "Authors:",
  "PDF:": "PDF:",
  "Title": "Title",
  "Authors": "Authors",
  "Upload PDF": "Upload PDF",
  "Choose file": "Choose file",
  "Save changes": "Save changes",
  "Cancel": "Cancel",
  "No items found": "No items found",
  "Loading...": "Loading...",
  "Mark all as read": "Mark all as read",
  "Mark as read": "Mark as read",
  "Are you sure?": "Are you sure?",
  "Confirm": "Confirm"
},
  pl: {
  "Login": "Zaloguj się",
  "Registration": "Rejestracja",
  "Email": "E‑mail",
  "Password": "Hasło",
  "Remember me": "Zapamiętaj mnie",
  "No account?": "Nie masz konta?",
  "Create account": "Utwórz konto",
  "Already have an account?": "Masz już konto?",
  "Logout": "Wyloguj",
  "Profile": "Profil",
  "My Profile": "Mój profil",
  "New password": "Nowe hasło",
  "First name": "Imię",
  "Last name": "Nazwisko",
  "Phone": "Telefon",
  "Save": "Zapisz",
  "Saved!": "Zapisano!",
  "Submit": "Prześlij",
  "Submit Title": "Prześlij tytuł",
  "My Works": "Moje prace",
  "Notifications": "Powiadomienia",
  "Professor": "Profesor",
  "Student": "Student",
  "Register": "Rejestracja",
  "Open menu": "Otwórz menu",
  "Search": "Szukaj",
  "Search by title or authors": "Szukaj po tytule lub autorach",
  "Create new Title": "Utwórz nowy tytuł",
  "Edit": "Edytuj",
  "Edit title": "Edytuj tytuł",
  "Delete": "Usuń",
  "Authors:": "Autorzy:",
  "PDF:": "PDF:",
  "Title": "Tytuł",
  "Authors": "Autorzy",
  "Upload PDF": "Prześlij PDF",
  "Choose file": "Wybierz plik",
  "Save changes": "Zapisz zmiany",
  "Cancel": "Anuluj",
  "No items found": "Brak wyników",
  "Loading...": "Ładowanie...",
  "Mark all as read": "Oznacz wszystkie jako przeczytane",
  "Mark as read": "Oznacz jako przeczytane",
  "Are you sure?": "Czy na pewno?",
  "Confirm": "Potwierdź"
}
};

export function I18nProvider({children}){
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'pl');
  useEffect(()=>{
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
  },[lang]);

  function t(key){
    const dict = DICTS[lang] || DICTS.en;
    return (dict[key?.trim?.()||key] || key);
  }

  const value = useMemo(()=>({ lang, setLang, t }),[lang]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(){ return useContext(I18nCtx) || { lang:'pl', setLang:()=>{}, t:(x)=>x }; }

export function LanguageSwitcher(){
  const { lang, setLang } = useI18n();
  return (
    <select
      aria-label="Language"
      value={lang}
      onChange={(e)=> setLang(e.target.value)}
      className="lang-select"
    >
      <option value="pl">PL</option>
      <option value="en">EN</option>
    </select>
  );
}

