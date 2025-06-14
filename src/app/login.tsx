import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await signIn({
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        showMessage({
          message: 'Welcome back!',
          description: 'You have successfully signed in.',
          type: 'success',
        });
        router.push('/');
      } else {
        showMessage({
          message: 'Sign In Failed',
          description: response.error || 'Unknown error occurred',
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Sign In Failed',
        description: 'An unexpected error occurred. Please try again.',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
    </>
  );
}
