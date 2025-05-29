import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <main className='flex justify-center items-center pt-10  '>
      <Card className='w-full max-w-6xl shadow-md'>
        <CardHeader>
          <CardTitle>About Us</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-gray-700 text-base'>
          <p>
            Welcome to LocalTalent — a platform built to connect skilled
            freelancers with clients who value quality, transparency, and ease
            of service.
          </p>
          <p>
            Our mission is to empower individuals to showcase their expertise
            while giving clients access to trusted, local services. Whether
            you're looking for a designer, developer, consultant, or creative —
            we've got you covered.
          </p>
          <p>
            Built with modern technologies and a focus on user experience,
            LocalTalent is designed to grow with your career or business.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
