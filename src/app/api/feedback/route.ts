import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const feedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(10),
  rating: z.number().min(1).max(5),
});

export async function POST(request: Request) {
  try {
    console.log('Received feedback request');
    const json = await request.json();
    console.log('Request data:', json);
    
    // Validate the request data
    const result = feedbackSchema.safeParse(json);
    
    if (!result.success) {
      console.error('Validation error:', result.error);
      return new NextResponse(
        JSON.stringify({
          message: 'Validation error',
          errors: result.error.format()
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, message, rating } = result.data;
    
    console.log('Creating feedback with data:', { name, email, message, rating });
    
    const feedback = await prisma.feedback.create({
      data: {
        name,
        email: email || null,
        message,
        rating: Number(rating), // Ensure rating is a number
      },
    });

    console.log('Feedback created successfully:', feedback);
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error in POST /api/feedback:', error);
    
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({
          message: 'Validation error',
          errors: error.format()
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle Prisma errors
    if (error instanceof Error) {
      console.error('Database error:', error);
      return new NextResponse(
        JSON.stringify({ 
          message: 'Database error',
          error: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        message: 'Internal Server Error',
        error: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
