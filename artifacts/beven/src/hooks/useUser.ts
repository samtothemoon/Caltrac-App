import { useLocalStorage } from '@/lib/storage';

export type UserProfile = {
  name: string;
  memberSince: string;
  isComplete: boolean;
  isGoodEnoughMode: boolean;
};

const defaultProfile: UserProfile = {
  name: '',
  memberSince: new Date().toISOString(),
  isComplete: false,
  isGoodEnoughMode: true, // Default to true based on app philosophy
};

export function useUser() {
  const [user, setUser] = useLocalStorage<UserProfile>('beven_user', defaultProfile);

  const saveUser = (profile: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...profile }));
  };

  const clearUser = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('local-storage'));
    window.location.href = '/onboarding';
  };

  return { user, saveUser, clearUser };
}
