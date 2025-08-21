import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { authAPI, type LoginRequest, type RegisterRequest } from './api';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.displayName || user.email}`,
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.detail || 'Invalid email or password',
        variant: 'destructive',
      });
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      toast({
        title: 'Account created!',
        description: 'Welcome to Expense Tracker',
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.detail || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate('/auth/sign-in');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    },
  });
};

export const useMe = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['me'],
    queryFn: authAPI.getMe,
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};