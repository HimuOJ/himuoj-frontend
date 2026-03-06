import { useState, useEffect } from 'react';

export function useAsyncData<T>(
  fetchFn: () => Promise<T[]>,
  deps: React.DependencyList = []
) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchFn();
        if (mounted) {
          setData(result);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, deps);

  return { loading, data };
}
