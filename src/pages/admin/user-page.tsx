import DynamicTable from '@/components/dynamic-table';
import { apiHelper } from '@/lib/api-helper';
import { useEffect, useState } from 'react';

const UserPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await apiHelper.get('/auth/get-all-users', {
        showToast: false,
      });
      setData(await result);
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <div>
      {!loading ? (
        <DynamicTable
          endpoint='user'
          data={
            data?.map((item: any) => ({
              id: item.id,
              name: item.name,
              email: item.email,
              role: item.role,
            })) || []
          }
          title='Users List'
        />
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default UserPage;
