import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Badge } from '@/components/ui/badge';
import { Search, Star, Filter } from 'lucide-react';
import axios from 'axios';
import { VITE_API_BASE_URL } from '@/lib/api';
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
const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState<serviceType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredServices, setFilteredServices] = useState<serviceType[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      const res = await axios.get(VITE_API_BASE_URL + '/service');
      const result = await res.data.data;
      setServices(await result);
      const categories = result.map((service: serviceType) => service.category);
      const uniqueCategories = Array.from(new Set(categories));
      setCategories(uniqueCategories as string[]);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;
    console.log(filtered);
    if (searchTerm?.trim() !== '') {
      filtered = filtered.filter((service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }
    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, services]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Browse Services
          </h1>
          <p className='text-gray-600'>
            Find the perfect local talent for your needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className='mb-8 bg-white p-6 rounded-lg shadow-sm'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Search services, freelancers, or keywords...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='flex gap-2'>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}>
                <SelectTrigger className='w-48'>
                  <Filter className='h-4 w-4 mr-2' />
                  <SelectValue placeholder='All Categories' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value='all'>All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className='mb-6'>
          <p className='text-gray-600'>
            Showing {filteredServices.length} of {services.length} services
          </p>
        </div>

        {/* Services Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredServices.map((service) => (
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
                  <CardTitle className='text-lg'>{service.title}</CardTitle>
                </div>
                <CardDescription>{service.description}</CardDescription>
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
                <Link to={`/services/${service.id}`} className='block mt-4'>
                  <Button className='w-full bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900'>
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>
              No services found matching your criteria.
            </p>
            <p className='text-gray-400 mt-2'>
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
