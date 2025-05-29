import Header from '@/components/header';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className='min-h-screen'>
      <Header />
      <Outlet />
    </div>
  );
}
