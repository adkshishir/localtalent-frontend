import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Zod schema for form validation
const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Please select a role'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Initialize React Hook Form with Zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      await register(values.name, values.email, values.password, values.role);

      navigate('/auth/login');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=''>
      <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold'>
              Join LocalTalent
            </CardTitle>
            <CardDescription>
              Create your account and start connecting with local talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter your full name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          placeholder='Create a password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I want to join as*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select your role' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='bg-white'>
                          <SelectItem value='USER'>
                            User (Book Services)
                          </SelectItem>
                          <SelectItem value='FREELANCER'>
                            Freelancer (Offer Services)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900'
                  disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </Form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                Already have an account?{' '}
                <Link
                  to='/auth/login'
                  className='text-blue-800 hover:text-purple-800 hover:underline'>
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
