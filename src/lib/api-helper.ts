import { toast } from '@/hooks/use-toast';
import { http } from './api';
import { AxiosResponse } from 'axios';

type HTTPMethod = 'get' | 'post' | 'put' | 'del' | 'postWithFile';
interface RequestOptions {
  config?: any;
  showToast?: boolean; // prevent toast
}

const handleRequest = async <T = any>(
  method: HTTPMethod,
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<T | null> => {
  const { config = {}, showToast = true } = options;
  try {
    const res: AxiosResponse =
      method === 'get' || method === 'del'
        ? await http[method]<T>(url, config)
        : await http[method]<T>(url, data, config);

    const responseData = res?.data?.data;

    if (showToast && ['post', 'put', 'del'].includes(method)) {
      toast({
        title: 'Success',
        description: res?.data?.message || 'Operation completed successfully',
        variant: 'default',
      });
    }

    return responseData;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || 'Something went wrong';
    if (showToast && ['post', 'put', 'del'].includes(method)) {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
    return null;
  }
};

export const apiHelper = {
  get: <T = any>(url: string, config?: RequestOptions) =>
    handleRequest<T>('get', url, undefined, config),

  post: <T = any>(url: string, data?: any, config?: RequestOptions) =>
    handleRequest<T>('post', url, data, config),

  put: <T = any>(url: string, data?: any, config?: RequestOptions) =>
    handleRequest<T>('put', url, data, config),

  del: <T = any>(url: string, config?: RequestOptions) =>
    handleRequest<T>('del', url, undefined, config),

  postWithFile: <T = any>(
    url: string,
    data: FormData,
    config?: RequestOptions
  ) => handleRequest<T>('postWithFile', url, data, config),
};
