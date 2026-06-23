import { useEffect, useState } from "react";

type UseDebounceProps = {
  value: string;
  delay: number;
};

export default function useDebounce({ value, delay }: UseDebounceProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
