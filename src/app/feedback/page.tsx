import prisma from '@/lib/prisma';
import { format, subDays } from 'date-fns';
import { Feedback } from '@prisma/client';
import { ExportButton } from '@/components/export-button';
import { DashboardStats } from '@/components/dashboard-stats';
import Link from 'next/link';
import { ArrowLeft, Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackTable } from '@/components/feedback-table';

interface FeedbackWithId extends Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default async function FeedbackPage() {
  // Get all feedback data
  const feedbacks = await prisma.feedback.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  }) as FeedbackWithId[];

  // Calculate statistics
  const [totalFeedback, averageRating, recentFeedbackCount, positiveFeedback, negativeFeedback] = await Promise.all([
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
    // Get positive feedback count (rating >= 4)
    prisma.feedback.count({
      where: {
        rating: {
          gte: 4,
        },
      },
    }),
    // Get negative feedback count (rating < 3)
    prisma.feedback.count({
      where: {
        rating: {
          lt: 3,
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedback}</div>
            <p className="text-xs text-muted-foreground">All feedback received</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}<span className="text-sm font-normal text-muted-foreground">/5</span></div>
            <p className="text-xs text-muted-foreground">From all ratings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positiveFeedback}</div>
            <p className="text-xs text-muted-foreground">Rating 4+ stars</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{negativeFeedback}</div>
            <p className="text-xs text-muted-foreground">Rating below 3 stars</p>
          </CardContent>
        </Card>
      </div>
      
      <FeedbackTable feedbacks={feedbacks} />
    </div>
  );
}
