import { useEffect, useState } from "react";

export const useDebouncedSearch = (delay: number = 450) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), delay);
    return () => clearTimeout(handler);
  }, [search, delay]);

  return { search, setSearch, debouncedSearch };
};
