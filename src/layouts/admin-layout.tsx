// File: src/layouts/AdminLayout.tsx
import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Workflow,
  ListOrdered,
  Users,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('localtalent_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 text-gray-800'>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 z-40 w-64 border-r bg-white shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}>
        <div className='flex items-center justify-between p-4 border-b'>
          <div className='font-bold text-lg'>Admin Panel</div>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setMobileOpen(false)}>
            <X className='w-5 h-5' />
          </Button>
        </div>
        <ScrollArea className='h-[calc(100vh-64px)] p-4 space-y-2'>
          {navbarItems?.map(
            (item) =>
              item.roles.includes(user?.role) && (
                <NavItem
                  to={item.to}
                  key={item.to}
                  icon={item.icon}
                  onClick={() => setMobileOpen(false)}>
                  {item.label}
                </NavItem>
              )
          )}
        </ScrollArea>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className='fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Area */}
      <div className='flex flex-col flex-1 h-full overflow-hidden'>
        {/* Top Header */}
        <header className='flex items-center justify-between p-4 border-b bg-white shadow-sm'>
          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setMobileOpen(true)}>
              <Menu className='w-5 h-5' />
            </Button>
          </div>
          <h1 className='text-lg font-semibold hidden md:block'>
            Admin Dashboard
          </h1>
          <div className='flex items-center gap-3'>
            <Button
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
              variant='destructive'
              className='text-sm font-medium  hidden sm:inline'>
              Logout
            </Button>
            <Link to='/'>
              <Avatar className='h-8 w-8'>
                <AvatarFallback>L T</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className='flex-1 overflow-y-auto p-4 bg-gray-50'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

type NavItemProps = {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
};

function NavItem({ to, icon, children, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={true}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors',
          isActive ? 'bg-gray-100 text-blue-800 font-semibold' : 'text-gray-700'
        )
      }>
      {icon}
      {children}
    </NavLink>
  );
}

const navbarItems = [
  {
    to: '/admin',
    icon: <LayoutDashboard size={18} />,
    label: 'Dashboard',
    roles: ['ADMIN', 'FREELANCER', 'USER'],
  },
  {
    to: '/admin/users',
    icon: <Users size={18} />,
    label: 'Users',
    roles: ['ADMIN'],
  },
  {
    to: '/admin/service',
    icon: <Workflow size={18} />,
    label: 'Services',
    roles: ['ADMIN', 'FREELANCER'],
  },
  {
    to: '/admin/bookings',
    icon: <ListOrdered size={18} />,
    label: 'Bookings',
    roles: ['ADMIN', 'FREELANCER', 'USER'],
  },
];
