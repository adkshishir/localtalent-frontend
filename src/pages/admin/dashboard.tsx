import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Star,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Header from '@/components/header';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className=' bg-gray-50'>
        <div className='flex items-center justify-center py-12'>
          <p>Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome back, {user.name}!
          </h1>
          <p className='text-gray-600 capitalize'>{user.role} Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
