import DynamicTable from '@/components/dynamic-table';
import { apiHelper } from '@/lib/api-helper';
import { useEffect, useState } from 'react';

const BookingPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('localtalent_user') || '{}');
      const url =
        user.role === 'FREELANCER'
          ? '/booking/freelancer'
          : user.role === 'USER'
          ? '/booking/user'
          : '/booking';
      const result = await apiHelper.get(url, {
        showToast: false,
      });
      setData(await result);
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DynamicTable
          endpoint='booking'
          data={
            data?.map((item: any) => ({
              id: item.id,
              Service: item.service?.title || 'N/A',
              status: item.status,
              date: new Date(item.date).toLocaleDateString(),
              time: item.time,
            })) || []
          }
          title='Booking List'
        />
      )}
    </div>
  );
};

export default BookingPage;
