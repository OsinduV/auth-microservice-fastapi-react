import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, extractErrorMessage } from '../services/authService';
import { useAuthContext } from '../context/AuthContext';
import type { LoginCredentials } from '../types';

export function useLoginForm() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const tokenResponse = await authService.login(credentials);
      await login(tokenResponse.access_token);
      navigate('/');
    } catch (err) {
      setError(extractErrorMessage(err, 'Login failed. Please check your credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error };
}
