import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, extractErrorMessage } from '../services/authService';
import type { RegisterCredentials } from '../types';

export function useRegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register({ email: credentials.email, password: credentials.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(extractErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error, success };
}
