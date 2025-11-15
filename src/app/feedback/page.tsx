import prisma from '@/lib/prisma';
import { format, subDays } from 'date-fns';
import { Feedback } from '@prisma/client';
import { ExportButton } from '@/components/export-button';
import { DashboardStats } from '@/components/dashboard-stats';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface FeedbackWithId extends Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default async function FeedbackPage() {
  const [feedbacks, totalFeedback, averageRating, recentFeedbackCount] = await Promise.all([
    prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    }) as Promise<FeedbackWithId[]>,
    // Get total feedback count
    prisma.feedback.count(),
    // Calculate average rating
    prisma.feedback.aggregate({
      _avg: {
        rating: true,
      },
    }).then(result => result._avg.rating || 0),
    // Get recent feedback count (last 7 days)
    prisma.feedback.count({
      where: {
        createdAt: {
          gte: subDays(new Date(), 7),
        },
      },
    }),
  ]);
  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <ExportButton />
        </div>
      </div>
      
      <DashboardStats 
        totalFeedback={totalFeedback}
        averageRating={averageRating}
        recentFeedback={recentFeedbackCount}
      />
      
<div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Feedback</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((feedback) => (
          <div key={feedback.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{feedback.name}</h3>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {feedback.rating}/5
              </div>
            </div>
            
            {feedback.email && (
              <p className="text-sm text-gray-600 mb-3">{feedback.email}</p>
            )}
            
            <p className="text-gray-700 mb-4">{feedback.message}</p>
            
            <div className="text-xs text-gray-500">
              Submitted on {format(new Date(feedback.createdAt), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
