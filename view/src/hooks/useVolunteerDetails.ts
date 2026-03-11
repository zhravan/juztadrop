import { useEffect, useState } from 'react';

export function useVolunteerDetails(id: string) {
  const [volunteer, setVolunteer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    fetch(`/api/volunteers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Volunteer not found');
        return res.json();
      })
      .then((data) => {
        setVolunteer(data);
      })
      .catch((err) => {
        setError(err.message ?? 'Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return { volunteer, isLoading, error };
}
