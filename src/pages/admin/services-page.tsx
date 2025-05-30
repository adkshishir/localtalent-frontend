import DynamicTable from '@/components/dynamic-table';
import { apiHelper } from '@/lib/api-helper';
import { useEffect, useState } from 'react';

const ServicesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await apiHelper.get('/service', {
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
          endpoint='service'
          data={
            data?.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              rate: item.rate,
              availability: item.availability,
              status: item.approved,
            })) || []
          }
          title='Services List'
        />
      )}
    </div>
  );
};

export default ServicesPage;
