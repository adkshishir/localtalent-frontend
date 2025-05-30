import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Calendar, MessageCircle } from 'lucide-react';
import BookingForm from '@/components/booking-form';
import { apiHelper } from '@/lib/api-helper';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [service, setService] = useState<null | any>({
    user: {},
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchService = async () => {
      try {
        const data = await apiHelper.get(`/service/${id}`);
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
      setLoading(false);
    };
    fetchService();
  }, []);
  const handleBookingClick = () => {
    if (!localStorage.getItem('access_token')) {
      navigate('/auth/login');
      return;
    }
    setShowBooking(true);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {loading ? (
          <div className='flex items-center justify-center'>
            <p className='text-gray-600 bg-yellow-50 rounded-md px-2 py-1 border border-gray-600'>
              Loading...
            </p>
          </div>
        ) : (
          <>
            {!showBooking && (
              <div className='grid lg:grid-cols-3 gap-8'>
                {/* Main Content */}
                <div className='lg:col-span-2 space-y-6'>
                  {/* Image Gallery */}
                  <Card className='overflow-hidden'>
                    <div className='aspect-video'>
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </Card>

                  {/* Service Info */}
                  <Card>
                    <CardHeader>
                      <div className='flex items-start justify-between'>
                        <div>
                          <Badge className='mb-2 bg-gradient-to-r from-blue-800 to-purple-800 '>
                            {service.category}
                          </Badge>
                          <CardTitle className='text-2xl'>
                            {service.title}
                          </CardTitle>
                          <div className='flex items-center gap-2 mt-2'></div>
                        </div>
                        <div className='text-right'>
                          <p className='text-2xl font-bold text-blue-800'>
                            ${service.rate}/hour
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className='text-base'>
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className='space-y-6'>
                  {/* Freelancer Card */}
                  <Card>
                    <CardHeader>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-12 w-12'>
                          <AvatarFallback>
                            {service.user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className='font-semibold'>
                            {service.user?.name}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            Member since{' '}
                            {new Date(service.user?.createdAt).getFullYear()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm text-gray-600 mb-4'>
                        {service.user?.bio}
                      </p>
                      {/* <div className='flex gap-2'>
                        <Button variant='outline' size='sm' className='flex-1'>
                          <MessageCircle className='h-4 w-4 mr-2' />
                          Message
                        </Button>
                      </div> */}
                    </CardContent>
                  </Card>

                  {/* Booking Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Book This Service</CardTitle>
                      <CardDescription>
                        Schedule your session with {service.user?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Clock className='h-4 w-4' />
                          <span>Typically responds within 1 hour</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <Calendar className='h-4 w-4' />
                          <span>Available 7 days a week</span>
                        </div>
                        <Button
                          className='w-full bg-gradient-to-r from-blue-800 to-purple-800 hover:shadow-xl hover:from-blue-900 hover:to-purple-900 transition-shadow'
                          size='lg'
                          onClick={handleBookingClick}>
                          Book Now - ${service.rate}/hour
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            {/* Booking Modal */}
            {showBooking && user && (
              <BookingForm
                service={service}
                onClose={() => setShowBooking(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
