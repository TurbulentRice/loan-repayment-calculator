import { createContext, useState } from 'react';

export const LoansContext = createContext();

export function LoansProvider({ children }) {
  const [loans, setLoans] = useState()
}