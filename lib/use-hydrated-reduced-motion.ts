'use client';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Keep the first client render identical to SSR, then honor the device setting.
export function useHydratedReducedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated && prefersReducedMotion;
}
