import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';

// Zod schema for form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Initialize React Hook Form with Zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      await login(values.email, values.password);
    } catch (error) {
      // Handle error - you might want to show a toast or error message
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold'>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your LocalTalent account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Enter your email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password*</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Enter your password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900 '
                  disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                {"Don't have an account? "}
                <Link
                  to='/auth/register'
                  className='text-blue-800 hover:text-purple-800 hover:underline'>
                  Sign up here
                </Link>
              </p>
            </div>

            <div className='mt-4 p-4 bg-gray-100 rounded-lg'>
              <p className='text-xs text-gray-600 mb-2'>Demo accounts:</p>
              <div className='space-y-1 text-xs'>
                <p>
                  <strong>User:</strong> user@demo.com
                </p>
                <p>
                  <strong>Freelancer:</strong> freelancer@demo.com
                </p>
                <p>
                  <strong>Admin:</strong> admin@demo.com
                </p>
                <p className=''>
                  <strong>Password</strong>: Password@123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
