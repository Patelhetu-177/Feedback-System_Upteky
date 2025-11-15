import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Star, Clock } from 'lucide-react';

type DashboardStatsProps = {
  totalFeedback: number;
  averageRating: number;
  recentFeedback: number; // Feedback in last 7 days
};

export function DashboardStats({
 
  totalFeedback,
  averageRating,
  recentFeedback,
}: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Feedback',
      value: totalFeedback,
      icon: MessageSquare,
      description: 'Feedback submissions',
    },
    {
      title: 'Avg. Rating',
      value: averageRating.toFixed(1),
      icon: Star,
      description: 'Average rating from all feedback',
    },
    {
      title: 'Recent Feedback',
      value: recentFeedback,
      icon: Clock,
      description: 'In the last 7 days',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
