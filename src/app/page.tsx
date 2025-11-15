'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


const FeedbackForm = dynamic(
  () => import('@/components/feedback-form').then((mod) => mod.FeedbackForm),
  {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-10 bg-blue-600 rounded-md w-full"></div>
      </div>
    </div>
  ),
});

export default function Home() {
  const { toast } = useToast();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Feedback Dashboard
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Share your thoughts and help us improve our service.
          </p>
          <div className="mt-6">
            <Link href="/feedback">
              <Button size="lg">
                View Feedback Dashboard
              </Button>
            </Link>
          </div>
        </div>
    
        <div className="mt-12">
          <FeedbackForm />
        </div>
        <Toaster toast={toast} />
      </div>
    </div>
  );
}
