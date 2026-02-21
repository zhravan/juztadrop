import { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/use-auth';
import { toast } from 'sonner';

interface ProfileForm {
  name: string;
  phone: string;
  gender: string;
  causes: string[];
  skills: Array<{ name: string; expertise: string }>;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function buildPayload(form: ProfileForm) {
  return {
    name: form.name || undefined,
    phone: form.phone || undefined,
    gender: form.gender || undefined,
    volunteering: {
      isInterest: true,
      skills: form.skills,
      causes: form.causes,
    },
  };
}

function formsEqual(a: ProfileForm, b: ProfileForm): boolean {
  return (
    a.name === b.name &&
    a.phone === b.phone &&
    a.gender === b.gender &&
    JSON.stringify(a.causes) === JSON.stringify(b.causes) &&
    JSON.stringify(a.skills) === JSON.stringify(b.skills)
  );
}

const DEBOUNCE_MS = 800;

export function useProfileForm() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    phone: '',
    gender: '',
    causes: [],
    skills: [],
  });

  const lastSavedRef = useRef<ProfileForm>(form);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const isMountedRef = useRef(true);
  const hydratedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Hydrate form from server data only once on initial load
  useEffect(() => {
    if (user && !hydratedRef.current) {
      hydratedRef.current = true;
      const serverForm: ProfileForm = {
        name: user.name ?? '',
        phone: user.phone ?? '',
        gender: user.gender ?? '',
        causes: user.volunteering?.causes ?? [],
        skills:
          user.volunteering?.skills?.map((s) => ({
            name: s.name,
            expertise: s.expertise || 'intermediate',
          })) ?? [],
      };
      setForm(serverForm);
      lastSavedRef.current = serverForm;
    }
  }, [user]);

  const save = useCallback(
    async (formToSave: ProfileForm) => {
      if (formsEqual(formToSave, lastSavedRef.current)) return;
      if (savingRef.current) return;

      savingRef.current = true;
      setSaveStatus('saving');
      try {
        const res = await fetch('/api/users/me', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload(formToSave)),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? 'Failed to update profile');

        lastSavedRef.current = formToSave;

        if (data.user) {
          queryClient.setQueryData(['auth', 'session'], data.user);
        }

        if (isMountedRef.current) {
          setSaveStatus('saved');
          toast.success('Profile updated');
        }
      } catch (err) {
        if (isMountedRef.current) setSaveStatus('error');
        toast.error(err instanceof Error ? err.message : 'Failed to update profile');
      } finally {
        savingRef.current = false;
      }
    },
    [queryClient]
  );

  const scheduleSave = useCallback(
    (nextForm: ProfileForm) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => save(nextForm), DEBOUNCE_MS);
    },
    [save]
  );

  const saveImmediately = useCallback(
    (nextForm: ProfileForm) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      save(nextForm);
    },
    [save]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const updateField = useCallback(
    (field: 'name' | 'phone', value: string) => {
      setForm((f) => {
        const next = { ...f, [field]: value };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const setGender = useCallback(
    (value: string) => {
      setForm((f) => {
        const next = { ...f, gender: f.gender === value ? '' : value };
        saveImmediately(next);
        return next;
      });
    },
    [saveImmediately]
  );

  const toggleCause = useCallback(
    (value: string) => {
      setForm((f) => {
        const next = {
          ...f,
          causes: f.causes.includes(value)
            ? f.causes.filter((x) => x !== value)
            : [...f.causes, value],
        };
        saveImmediately(next);
        return next;
      });
    },
    [saveImmediately]
  );

  const toggleSkill = useCallback(
    (skill: string) => {
      setForm((f) => {
        const exists = f.skills.find((s) => s.name === skill);
        const next = exists
          ? { ...f, skills: f.skills.filter((s) => s.name !== skill) }
          : { ...f, skills: [...f.skills, { name: skill, expertise: 'intermediate' }] };
        saveImmediately(next);
        return next;
      });
    },
    [saveImmediately]
  );

  const setSkillExpertise = useCallback(
    (skillName: string, expertise: string) => {
      setForm((f) => {
        const next = {
          ...f,
          skills: f.skills.map((s) => (s.name === skillName ? { ...s, expertise } : s)),
        };
        saveImmediately(next);
        return next;
      });
    },
    [saveImmediately]
  );

  return {
    form,
    saveStatus,
    updateField,
    setGender,
    toggleCause,
    toggleSkill,
    setSkillExpertise,
    setForm,
  };
}
