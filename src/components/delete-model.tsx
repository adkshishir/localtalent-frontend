import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { apiHelper } from '@/lib/api-helper';
import { useNavigate } from 'react-router-dom';

interface DeleteModalProps {
  url: string;
  title?: string;
  description?: string;
  itemName?: string;
}

export default function DeleteModal({
  url,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await apiHelper.del(url, {
        showToast: true,
      });
      setIsOpen(false);
      navigate(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while deleting'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild id='delete-modal-trigger'>
        <Button
          size='sm'
          disabled={isDeleting}
          variant='destructive'
          onClick={() => setIsOpen(true)}>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
              <Trash2 className='h-5 w-5 text-red-600' />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className='text-left'>
            {description}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogTrigger asChild>
            <Button variant='outline' disabled={isDeleting}>
              Cancel
            </Button>
          </DialogTrigger>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
