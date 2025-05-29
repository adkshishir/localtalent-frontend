import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Send form data to your API endpoint
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex justify-center items-center min-h-screen px-4 bg-gray-50'>
      <Card className='w-full max-w-lg shadow-md'>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                value={form.name}
                onChange={handleChange}
                required
                placeholder='Your name'
              />
            </div>

            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                required
                placeholder='you@example.com'
              />
            </div>

            <div>
              <Label htmlFor='message'>Message</Label>
              <Textarea
                id='message'
                name='message'
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder='Your message...'
              />
            </div>

            <Button  type='submit' disabled={loading} className='w-full bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900'>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
