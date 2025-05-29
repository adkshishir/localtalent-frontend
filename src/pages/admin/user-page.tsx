import DynamicTable from '@/components/dynamic-table';
import { apiHelper } from '@/lib/api-helper';
import { useEffect, useState } from 'react';

const UserPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await apiHelper.get('/auth/get-all-users', {
        showToast: false,
      });
      setData(await result);
    };

    fetchData();
  }, []);
  return (
    <div>
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
    </div>
  );
};

export default UserPage;
