import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome back, {user?.name}!
          </h1>
          <p className='text-gray-600 capitalize'>{user?.role} Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
