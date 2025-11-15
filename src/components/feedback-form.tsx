'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from './ui/use-toast';

const feedbackSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).optional().or(z.literal('')),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  rating: z.number().min(1).max(5),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      rating: 5,
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      setIsSubmitting(true);
      // Ensure rating is a number
      const formData = {
        name: data.name,
        email: data.email,
        message: data.message,
        rating: Number(data.rating)
      };
      
      console.log('Submitting form data:', formData); // Debug log
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          // Handle validation errors
          console.error('Validation errors:', responseData.errors);
          showToast({
            title: 'Validation Error',
            description: 'Please check the form for errors.',
            variant: 'destructive',
          });
        } else {
          throw new Error(responseData.message || 'Failed to submit feedback');
        }
        return;
      }

      showToast({
        title: 'Success!',
        description: 'Thank you for your feedback!',
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRating = useWatch({
    control,
    name: 'rating',
    defaultValue: 5,
  });
  
  // Ensure currentRating is always a number
  const ratingValue = typeof currentRating === 'string' ? parseInt(currentRating, 10) : currentRating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Feedback</h2>
        <p className="text-muted-foreground">
          We'd love to hear your thoughts, suggestions, or concerns.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Name *
            </label>
            <Input
              id="name"
              placeholder="Your name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Rating *
            </label>
            <div className="flex items-center space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="cursor-pointer">
                  <input
                    type="radio"
                    value={star}
                    checked={currentRating === star}
                    onChange={() => {
                      // Explicitly set the value as a number
                      register('rating').onChange({
                        target: { value: star, name: 'rating' }
                      });
                    }}
                    className="sr-only"
                  />
                  <span className="text-2xl">
                    {star <= (ratingValue || 0) ? '★' : '☆'}
                  </span>
                </label>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-red-500 mt-1">
                {errors.rating.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Message *
            </label>
            <Textarea
              id="message"
              placeholder="Share your thoughts..."
              rows={4}
              {...register('message')}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.message.message as string}
              </p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </motion.div>
  );
}
