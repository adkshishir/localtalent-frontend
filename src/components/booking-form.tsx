import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { apiHelper } from '@/lib/api-helper';

// Form validation schema
const bookingFormSchema = z.object({
  date: z.date({
    required_error: 'Please select a date',
  }),
  time: z
    .string({
      required_error: 'Please select a time',
    })
    .min(1, 'Please select a time'),
  duration: z
    .string({
      required_error: 'Please select a duration',
    })
    .min(1, 'Please select a duration'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  service: any;
  onClose: () => void;
}

const BookingForm = ({ service, onClose }: BookingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Create a date object for today at start of day for proper comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const defaultDisabled = (date: Date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      notes: '',
    },
  });

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  const durations = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
  ];

  const watchedDuration = form.watch('duration');

  const calculateTotal = () => {
    if (!watchedDuration) return 0;
    const hourlyRate = Number(service.rate);
    return hourlyRate * Number(watchedDuration);
  };

  const onSubmit = async (values: BookingFormValues) => {
    setIsLoading(true);
    try {
      await apiHelper.post('/booking', {
        serviceId: service.id,
        date: values.date,
        time: values.time,
        duration: Number(values.duration),
        notes: values.notes,
      });
      onClose();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Booking Details</CardTitle>
            <CardDescription>
              Select your preferred date, time, and duration
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name={'date'}
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Pick a date*</FormLabel>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}>
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={(selectedDate) => {
                            if (selectedDate) {
                              // Update the form field value
                              field.onChange(selectedDate);

                              // Close the popover after a brief delay to ensure the selection is processed
                              requestAnimationFrame(() => {
                                setTimeout(() => {
                                  setIsCalendarOpen(false);
                                }, 100);
                              });
                            }
                          }}
                          disabled={defaultDisabled}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select time' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-white'>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select duration' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-white'>
                      {durations.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Any specific requirements or additional information...'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span>Service:</span>
                <span>{service.title}</span>
              </div>
              <div className='flex justify-between'>
                <span>Freelancer:</span>
                <span>{service.user.name}</span>
              </div>
              <div className='flex justify-between'>
                <span>Rate:</span>
                <span>{service.rate}</span>
              </div>
              {watchedDuration && (
                <div className='flex justify-between'>
                  <span>Duration:</span>
                  <span>
                    {watchedDuration} hour
                    {watchedDuration !== '1' ? 's' : ''}
                  </span>
                </div>
              )}
              {watchedDuration && (
                <div className='flex justify-between font-semibold text-lg pt-2 border-t'>
                  <span>Total:</span>
                  <span className='text-blue-800'>${calculateTotal()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className='flex gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='flex-1'>
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isLoading}
            className='flex-1 bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900'>
            {isLoading ? 'Submitting...' : 'Submit Booking Request'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
