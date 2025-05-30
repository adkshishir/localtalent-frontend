'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LogOut, User, Calendar, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem('localtalent_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser || '{}'));
    }
  }, []);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { to: '/', label: 'Home' },
    { to: '/services', label: ' Services' },
    // { to: '/how-it-works', label: 'How It Works' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link
            to='/'
            className='flex items-center space-x-3 hover:opacity-90 transition-opacity'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-800 to-purple-800  hover:shadow-xl transition-shadow'>
              <span className='text-lg font-bold text-white'>LT</span>
            </div>
            <span className='text-xl font-bold text-gray-900 sm:text-2xl'>
              Local Talent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden items-center space-x-8 lg:flex'>
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className='text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 hover:underline hover:underline-offset-4 py-2'>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className='hidden items-center space-x-4 lg:flex'>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={user.avatar || '/placeholder.svg'}
                        alt={user.name}
                      />
                      <AvatarFallback className='bg-gradient-to-r from-blue-800 to-purple-800 text-white font-semibold'>
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-64 shadow-lg border-0 bg-white'
                  align='end'
                  forceMount>
                  <DropdownMenuLabel className='font-normal p-4'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-semibold leading-none text-gray-900'>
                        {user.name}
                      </p>
                      <p className='text-xs leading-none text-gray-500'>
                        {user.email}
                      </p>
                      <p className='text-xs leading-none text-blue-800 capitalize font-medium bg-blue-50 px-2 py-1 rounded-full mt-2 inline-block w-fit'>
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/admin')}
                    className='cursor-pointer hover:bg-gray-50 p-3'>
                    <User className='mr-3 h-4 w-4 text-gray-500' />
                    <span className='font-medium'>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/admin/bookings')}
                    className='cursor-pointer hover:bg-gray-50 p-3'>
                    <Calendar className='mr-3 h-4 w-4 text-gray-500' />
                    <span className='font-medium'>My Bookings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='text-red-600 cursor-pointer hover:bg-red-50 p-3'>
                    <LogOut className='mr-3 h-4 w-4' />
                    <span className='font-medium'>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='flex items-center space-x-3'>
                <Link to='/auth/login'>
                  <Button
                    variant='ghost'
                    className='font-medium hover:bg-gray-100 transition-colors'>
                    Log In
                  </Button>
                </Link>
                <Link to='/auth/register'>
                  <Button className='bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900 font-medium shadow-sm hover:shadow-xl transition-all duration-200'>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className='flex items-center space-x-2 lg:hidden'>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={user.avatar || '/placeholder.svg'}
                        alt={user.name}
                      />
                      <AvatarFallback className='bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold'>
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-56 shadow-lg'
                  align='end'
                  forceMount>
                  <DropdownMenuLabel className='font-normal p-3'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-semibold leading-none'>
                        {user.name}
                      </p>
                      <p className='text-xs leading-none text-gray-500'>
                        {user.email}
                      </p>
                      <p className='text-xs leading-none text-blue-800 capitalize font-medium'>
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/admin')}
                    className='cursor-pointer'>
                    <User className='mr-2 h-4 w-4' />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/admin/bookings')}
                    className='cursor-pointer'>
                    <Calendar className='mr-2 h-4 w-4' />
                    <span>My Bookings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='text-red-600 cursor-pointer'>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='lg:hidden hover:bg-gray-100'>
                  <Menu className='h-6 w-6' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-[300px] sm:w-[400px] bg-white'>
                <SheetHeader className='border-b pb-4'>
                  <SheetTitle className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600'>
                        <span className='text-sm font-bold text-white'>LT</span>
                      </div>
                      <span className='text-lg font-bold'>Local Talent</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className='mt-8 flex flex-col space-y-6'>
                  <nav className='flex flex-col space-y-4'>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className='text-lg font-medium text-gray-700 transition-colors hover:text-blue-800 py-2 border-b border-gray-100 hover:border-blue-200'
                        onClick={closeMobileMenu}>
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {!user && (
                    <div className='pt-6 border-t border-gray-200'>
                      <div className='flex flex-col space-y-4'>
                        <Link to='/auth/login' onClick={closeMobileMenu}>
                          <Button
                            variant='outline'
                            className='w-full h-12 font-medium'>
                            Log In
                          </Button>
                        </Link>
                        <Link to='/auth/register' onClick={closeMobileMenu}>
                          <Button className='w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium'>
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
