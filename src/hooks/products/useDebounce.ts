import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMilliseconds: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMilliseconds);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayMilliseconds]);

  return debouncedValue;
}
