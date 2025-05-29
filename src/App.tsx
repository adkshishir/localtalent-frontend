import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages';
import Login from './pages/login';
import Register from './pages/register';
import Services from './pages/services';
import ServiceDetail from './pages/service-details';
import Dashboard from './pages/admin/dashboard';
import NotFound from './pages/not-found';
import { AuthProvider } from './contexts/AuthContext';
import PublicLayout from './layouts/public-layout';
import AuthLayout from './layouts/auth-layout';
import AdminLayout from './layouts/admin-layout';
import ServiceForm from './pages/admin/service-form';
import ServicesPage from './pages/admin/services-page';
import BookingPage from './pages/admin/booking-page';
import About from './pages/about';
import Contact from './pages/contact';

const App = () => (
  <AuthProvider>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthLayout />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='' element={<Dashboard />} />
          <Route path='service/create' element={<ServiceForm />} />
          <Route path='service' element={<ServicesPage />} />
          <Route path='service/:id/edit' element={<ServiceForm />} />
          <Route path='bookings' element={<BookingPage />} />
          <Route path='*' element={<NotFound />} />
        </Route>

        <Route path='/' element={<PublicLayout />}>
          <Route path='' element={<Index />} />
          <Route path='services' element={<Services />} />
          <Route path='services/:id' element={<ServiceDetail />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
