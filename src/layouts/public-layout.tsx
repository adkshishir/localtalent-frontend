import Header from '@/components/header';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
