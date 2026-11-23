"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const CURRENCIES = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "United States" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "MKD", symbol: "", flag: "🇲🇰", name: "Macedonia" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "United Kingdom" },
  { code: "CHF", symbol: "Fr", flag: "🇨🇭", name: "Switzerland" },
  { code: "AUD", symbol: "A$", flag: "🇦🇺", name: "Australia" },
];

type Currency = (typeof CURRENCIES)[number];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (amountInUSD: number) => string;
  currencies: typeof CURRENCIES;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState(CURRENCIES[0]); // USD default
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live rates once on mount (base = USD)
    fetch("https://api.frankfurter.app/latest?from=USD")
      .then((r) => r.json())
      .then((data) => {
        setRates({ USD: 1, ...data.rates });
        setLoading(false);
      })
      .catch(() => {
        // Fallback to approximate rates if API fails
        setRates({ USD: 1, EUR: 0.92, MKD: 57.5, GBP: 0.79, CHF: 0.9, AUD: 1.53 });
        setLoading(false);
      });
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("preferredCurrency", c.code);
  };

  // Restore preference on load
  useEffect(() => {
    const saved = localStorage.getItem("preferredCurrency");
    if (saved) {
      const found = CURRENCIES.find((c) => c.code === saved);
      if (found) setCurrencyState(found);
    }
  }, []);

 const convert = (amountInUSD: number): string => {
  const rate = rates[currency.code] ?? 1;
  const converted = amountInUSD * rate;
  return `${currency.symbol}${converted.toFixed(2)} ${currency.code}`;
};

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, currencies: CURRENCIES, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be inside CurrencyProvider");
  return ctx;
}