import { useEffect, useState } from 'react';

interface Technology {
  value: string;
  label: string;
}

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch("https://api.github.com/search/topics?q=language", {
          headers: { Accept: "application/vnd.github.mercy-preview+json" },
        });
        if (!response.ok) throw new Error("Failed to fetch technologies");

        const data = await response.json();
        const topics = data.items.map((item: { name: string }) => ({
          value: item.name,
          label: item.name,
        }));

        setTechnologies(topics);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch technologies");
        console.error("Error fetching technologies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  return { technologies, loading, error };
} 