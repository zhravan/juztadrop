import { useEffect, useState } from 'react';

export function useVolunteerDetails(id: string) {
  const [volunteer, setVolunteer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVolunteer = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/volunteers/users/${id}`);

        const data = await res.json();
        console.log(data);
        // setVolunteer(data);
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteer();
  }, [id]);

  return { volunteer, isLoading, error };
}
