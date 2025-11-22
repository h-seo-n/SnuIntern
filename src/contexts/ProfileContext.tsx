import { isAxiosError } from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import apiClient from '../api';
import type { ProfileResponse } from '../types';

interface ProfileContextType {
  profile: ProfileResponse | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/api/applicant/me');
      setProfile(response.data);
    } catch (e) {
      if (isAxiosError(e) && e.response) {
        const code = (e.response.data as { code?: string }).code;

        if (code === 'APPLICANT_002') {
          setProfile(null); // 프로필 없음
        } else {
          setError(`API Error: ${code}`);
        }
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
};
