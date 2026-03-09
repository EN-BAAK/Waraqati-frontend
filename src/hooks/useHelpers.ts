import { useEffect, useRef, useState } from "react";

export const useDebouncedSearch = (delay: number = 450) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), delay);
    return () => clearTimeout(handler);
  }, [search, delay]);

  return { search, setSearch, debouncedSearch };
};

export function useOnScreen(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return { isVisible, ref };
}