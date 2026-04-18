"use client";
import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
    EN: {
        portal: "Samraddh Bharat",
        subtitle: "Government of Chhattisgarh",
        services: "Services",
        login: "Login",
        logout: "Logout",
    },
    HI: {
        portal: "समृद्ध भारत",
        subtitle: "छत्तीसगढ़ सरकार",
        services: "सेवाएं",
        login: "लॉगिन",
        logout: "लॉगआउट",
    },
};

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState("EN");

    const toggleLang = () => {
        setLang((prev) => (prev === "EN" ? "HI" : "EN"));
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t: translations[lang] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLang = () => useContext(LanguageContext);