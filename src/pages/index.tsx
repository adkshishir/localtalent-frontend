import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Shield, MoveRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { VITE_API_BASE_URL } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

type serviceType = {
  id: number;
  title: string;
  description: string;
  rate: number;
  availability: string;
  imageUrl: string;
  approved: 'APPROVED' | 'PENDING' | 'REJECTED';
  userId: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};
const Index = () => {
  const [services, setServices] = useState<serviceType[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchServices = async () => {
      const res = await axios.get(VITE_API_BASE_URL + '/service');
      const result = await res.data.data;
      setServices(await result);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const features = [
    {
      icon: <Search className='h-6 w-6 text-blue-800' />,
      title: 'Easy Discovery',
      description:
        'Find local talent quickly with our smart search and filtering system',
    },
    {
      icon: <Shield className='h-6 w-6 text-green-600' />,
      title: 'Verified Professionals',
      description:
        'All freelancers are vetted and verified for quality assurance',
    },
    {
      icon: <Clock className='h-6 w-6 text-purple-600' />,
      title: 'Instant Booking',
      description: 'Book services instantly with real-time availability',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-800 to-purple-800 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>
            Find Amazing Local Talent
          </h1>
          <p className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto'>
            Connect with skilled freelancers in your area for photography,
            tutoring, design, and more
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/services'>
              <Button
                size='lg'
                className='bg-white w-56 text-blue-800 hover:bg-gray-100'>
                Browse Services
              </Button>
            </Link>
            <Link to='/auth/register'>
              <Button
                size='lg'
                variant='outline'
                className='border-white bg-gradient-to-r w-56  from-blue-800  to-purple-800 text-white hover:bg-white hover:text-white hover:from-blue-900 hover:to-purple-900'>
                Join as Freelancer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Why Choose LocalTalent?
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <Card key={index} className='text-center'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center mb-12'>
            <h2 className='text-3xl max-lg:text-xl font-bold'>
              Featured Services
            </h2>
            <Link
              className='hover:underline max-lg:text-sm flex gap-2 items-center text-blue-800 hover:text-purple-800'
              to='/services'>
              {/* <Button className='bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900'> */}
              View All Services <MoveRightIcon />
              {/* </Button> */}
            </Link>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            {!loading
              ? services.map(
                  (service, index) =>
                    index < 3 && (
                      <Card
                        key={service.id}
                        className='overflow-hidden hover:shadow-lg transition-shadow'>
                        <div className='aspect-video relative'>
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className='w-full h-full object-cover'
                          />
                          <Badge className='absolute top-2 left-2 bg-white text-gray-900'>
                            {service.category || 'Category'}
                          </Badge>
                        </div>
                        <CardHeader>
                          <div className='flex justify-between items-start'>
                            <CardTitle className='text-lg'>
                              {service.title}
                            </CardTitle>
                          </div>
                          <CardDescription>
                            {service.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className='flex justify-between items-center'>
                            <p className='text-sm text-gray-600'>
                              by {service.user.name}
                            </p>
                            <p className='font-semibold text-blue-800'>
                              ${service.rate}/hour
                            </p>
                          </div>
                          <Link
                            to={`/services/${service.id}`}
                            className='block mt-4'>
                            <Button className='w-full bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900'>
                              View Details
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )
                )
              : // loading cards
                Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className='overflow-hidden hover:shadow-lg transition-shadow'>
                    <div className='aspect-video relative'>
                      <Skeleton className='w-full h-full object-cover' />
                    </div>
                    <CardHeader>
                      <div className='flex justify-between items-start'>
                        <CardTitle className='text-lg'>
                          <Skeleton />
                        </CardTitle>
                      </div>
                      <CardDescription>
                        <Skeleton />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Skeleton />
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      <section className='py-16 bg-slate-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-6'>Ready to Get Started?</h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Join thousands of satisfied customers who found their perfect local
            talent
          </p>
          <Link to='/auth/register'>
            <Button
              size='lg'
              className='bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900 '>
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
