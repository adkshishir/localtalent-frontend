import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { apiHelper } from '@/lib/api-helper';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

// Zod schema for validation
const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  rate: z
    .number()
    .min(0.01, 'Rate must be greater than 0')
    .max(10000, 'Rate must be less than 10,000'),
  availability: z
    .string()
    .min(1, 'Availability is required')
    .min(5, 'Availability must be at least 5 characters'),
  imageUrl: z.string().nullable(),
  image: z.any().nullable(),
  category: z.string().min(1, 'Category is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function ServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 1. Define your form.
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      rate: 0,
      availability: '',
      imageUrl: '',
      category: '',
    },
  });
  useEffect(() => {
    // If an ID is provided, fetch the existing service data
    const fetchServiceData = async () => {
      if (id) {
        try {
          const responseData = await apiHelper.get(`/service/${id}`, {
            showToast: false,
          });
          if (responseData) {
            form.reset({
              title: responseData.title,
              description: responseData.description,
              rate: responseData.rate,
              availability: responseData.availability,
              imageUrl: responseData.imageUrl,
              category: responseData.category,
            });
          }
        } catch (error) {
          console.error('Error fetching service data:', error);
        }
      }
    };

    fetchServiceData();
  }, [id]);

  // 2. Define a submit handler.
  async function onSubmit(data: FormData) {
    try {
      let imageresponse = null;
      const formData = new FormData();
      formData.append('image', data.image);
      if (data.image) {
        imageresponse = await apiHelper.postWithFile('/upload', formData, {
          showToast: false,
        });
      }

      const responseData = !id
        ? await apiHelper.post('/service', {
            title: data.title,
            description: data.description,
            rate: data.rate,
            availability: data.availability,
            category: data.category,
            imageUrl: imageresponse ? imageresponse.fileUrl : data.imageUrl,
          })
        : await apiHelper.put(`/service/${id}`, {
            title: data.title,
            description: data.description,
            rate: data.rate,
            availability: data.availability,
            category: data.category,
            imageUrl: imageresponse ? imageresponse.fileUrl : data.imageUrl,
          });
      if (responseData) {
        navigate('/admin/service');
      }

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
    }
  }

  const handleReset = () => {
    form.reset();
    form.reset({
      title: '',
      description: '',
      rate: 0,
      availability: '',
      imageUrl: '',
    });
  };

  return (
    <div className=' bg-gray-50 py-8 px-4'>
      <div className='max-w-2xl mx-auto space-y-6'>
  

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Enter the information about your service offering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'>
                {/* Title Field */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter service title' {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Rate Field */}
                  <FormField
                    control={form.control}
                    name='rate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate (per hour)</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                              $
                            </span>
                            <Input
                              type='number'
                              step='0.01'
                              min='0'
                              placeholder='0.00'
                              className='pl-8'
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe your service in detail'
                          rows={4}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter category' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Availability Field */}
                <FormField
                  control={form.control}
                  name='availability'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., Monday-Friday, 9AM-5PM'
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URL Field */}
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image </FormLabel>
                      <FormControl>
                        <Input
                          type='file'
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            form.setValue('image', file);
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Form Actions */}
                <div className='flex gap-4 pt-4'>
                  <Button
                    type='submit'
                    disabled={form.formState.isSubmitting}
                    className='flex-1'>
                    {form.formState.isSubmitting
                      ? !id
                        ? 'Creating Service...'
                        : 'Updating Service...'
                      : !id
                      ? 'Create Service'
                      : 'Update Service'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleReset}
                    className='flex-1'>
                    Reset Form
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
