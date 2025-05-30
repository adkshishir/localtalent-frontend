'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  XCircle,
} from 'lucide-react';
import DeleteModal from './delete-model';
import { Link } from 'react-router-dom';
import { apiHelper } from '@/lib/api-helper';
import { Badge } from '@/components/ui/badge';

interface DynamicTableProps {
  data: any[];
  title?: string;
  endpoint?: string;
  onDataUpdate?: (updatedData: any[]) => void;
}

export default function DynamicTable({
  data,
  title = 'Data Table',
  endpoint = '',
  onDataUpdate,
}: DynamicTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [user, setUser] = useState<any>(null);
  const [paginatedData, setPaginatedData] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('localtalent_user') || '{}'));
  }, []);

  // Get all unique keys from the data
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] !== 'object' || item[key] === null) {
          allKeys.add(key);
        } else {
          // Handle nested objects (like user.name)
          Object.keys(item[key]).forEach((nestedKey) => {
            allKeys.add(`${key}.${nestedKey}`);
          });
        }
      });
    });

    return Array.from(allKeys);
  }, [data]);

  // Get value from nested object
  const getValue = (obj: any, path: string) => {
    if (path.includes('.')) {
      const [parent, child] = path.split('.');
      return obj[parent]?.[child];
    }
    return obj[path];
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      return columns.some((column) => {
        const value = getValue(item, column);
        return String(value || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Update pagination when dependencies change
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedData(filteredData.slice(startIndex, endIndex));
  }, [filteredData, currentPage, pageSize]);

  // Reset to first page when search term or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  // Format column header
  const formatHeader = (column: string) => {
    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('.', ' ');
  };

  // Format cell value
  const formatValue = (value: any, columnName: string) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);

    // Check if this is a status column and render as badge
    if (
      columnName.toLowerCase().includes('status') &&
      typeof value === 'string'
    ) {
      const getStatusVariant = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
          case 'approved':
          case 'accepted':
          case 'completed':
            return 'default'; // Green-ish
          case 'pending':
          case 'in_progress':
            return 'secondary'; // Yellow-ish
          case 'rejected':
          case 'declined':
          case 'cancelled':
            return 'destructive'; // Red
          default:
            return 'outline';
        }
      };

      return (
        <Badge variant={getStatusVariant(value)} className='capitalize'>
          {value.replace(/_/g, ' ').toLowerCase()}
        </Badge>
      );
    }

    return String(value);
  };

  async function approveOrReject(id: number, status: string) {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      await apiHelper.put(
        `/service/approve-or-reject/${id}`,
        { status },
        { showToast: true }
      );

      // Update the local data to reflect the new status
      setPaginatedData(
        paginatedData.map((item) => {
          if (item.id === id) {
            return { ...item, status }; // Update the status
          }
          return item;
        })
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleBookingStatus(id: number, status: string) {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      await apiHelper.put(
        `/booking/status/${id}`,
        { status },
        { showToast: true }
      );

      // Update the local data to reflect the new status
      setPaginatedData(
        paginatedData.map((item) => {
          if (item.id === id) {
            return { ...item, status }; // Update the status
          }
          return item;
        })
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center justify-between mb-4'>
          <CardTitle>{title}</CardTitle>
          {endpoint === 'service' && user?.role === 'FREELANCER' ? (
            <Link
              className='inline-flex items-center'
              to={`/admin/${endpoint}/create`}>
              <Button>Create New</Button>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Search and Page Size */}
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className='pl-10'
            />
          </div>

          <div className='flex items-center gap-2'>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
              }}>
              <SelectTrigger className='w-[100px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5 rows</SelectItem>
                <SelectItem value='10'>10 rows</SelectItem>
                <SelectItem value='20'>20 rows</SelectItem>
                <SelectItem value='50'>50 rows</SelectItem>
              </SelectContent>
            </Select>

            <span className='text-sm text-gray-600'>
              {filteredData.length} items
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Table */}
        <div className='rounded-md border overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className='whitespace-nowrap'>
                    {formatHeader(column)}
                  </TableHead>
                ))}
                {!(user?.role == 'USER'|| user?.role == 'ADMIN' && endpoint == 'booking') && (
                  <TableHead className='whitespace-nowrap'>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className='text-center py-8 text-gray-500'>
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id || index}>
                    {columns.map((column) => (
                      <TableCell key={column} className='whitespace-nowrap'>
                        {formatValue(getValue(item, column), column)}
                      </TableCell>
                    ))}
                    {endpoint == 'service' &&
                      (user?.role != 'ADMIN' ? (
                        <TableCell className='whitespace-nowrap'>
                          <div className='flex items-center gap-2'>
                            <Link to={`/admin/${endpoint}/${item.id}/edit`}>
                              <Button variant='outline' size='sm'>
                                Edit
                              </Button>
                            </Link>
                            <DeleteModal url={`${endpoint}/${item.id}`} />
                          </div>
                        </TableCell>
                      ) : (
                        <TableCell className='whitespace-nowrap'>
                          <div className='flex items-center gap-2'>
                            <Button
                              size='sm'
                              onClick={() =>
                                approveOrReject(item.id, 'APPROVED')
                              }
                              disabled={loadingStates[item.id]}
                              className='bg-green-600 hover:bg-green-700'>
                              <CheckCircle className='h-4 w-4 mr-1' />
                              {loadingStates[item.id]
                                ? 'Processing...'
                                : 'Approve'}
                            </Button>
                            <Button
                              onClick={() =>
                                approveOrReject(item.id, 'REJECTED')
                              }
                              size='sm'
                              variant='destructive'
                              disabled={loadingStates[item.id]}>
                              <XCircle className='h-4 w-4 mr-1' />
                              {loadingStates[item.id]
                                ? 'Processing...'
                                : 'Reject'}
                            </Button>
                          </div>
                        </TableCell>
                      ))}
                    {endpoint == 'booking' && user?.role === 'FREELANCER' && (
                      <TableCell className='whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                          <Button
                            size='sm'
                            onClick={() =>
                              handleBookingStatus(item.id, 'ACCEPTED')
                            }
                            disabled={loadingStates[item.id]}
                            className='bg-green-600 hover:bg-green-700'>
                            <CheckCircle className='h-4 w-4 mr-1' />
                            {loadingStates[item.id]
                              ? 'Processing...'
                              : 'Accept'}
                          </Button>
                          <Button
                            size='sm'
                            variant='destructive'
                            onClick={() =>
                              handleBookingStatus(item.id, 'REJECTED')
                            }
                            disabled={loadingStates[item.id]}>
                            <XCircle className='h-4 w-4 mr-1' />
                            {loadingStates[item.id]
                              ? 'Processing...'
                              : 'Decline'}
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    {endpoint == 'user' && user?.role == 'ADMIN' && (
                      <TableCell className='whitespace-nowrap'>
                        <DeleteModal url={`auth/${item.id}`} />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-gray-600'>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredData.length)} of{' '}
              {filteredData.length} results
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}>
                <ChevronLeft className='h-4 w-4' />
                Previous
              </Button>

              <span className='text-sm'>
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}>
                Next
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
