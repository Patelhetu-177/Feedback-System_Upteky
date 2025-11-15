import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    // Fetch all feedback from the database
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Prepare data for export
    const data = feedbacks.map((feedback) => ({
      'ID': feedback.id,
      'Name': feedback.name || 'N/A',
      'Email': feedback.email || 'N/A',
      'Rating': feedback.rating,
      'Message': feedback.message,
      'Created At': new Date(feedback.createdAt).toLocaleString(),
    }));

    if (format.toLowerCase() === 'excel') {
        // Create Excel file
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');
      
      // Generate Excel buffer
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create response with Excel file
      const headers = new Headers();
      headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      headers.set('Content-Disposition', 'attachment; filename=feedback-export.xlsx');
      
      return new NextResponse(Buffer.from(excelBuffer), {
        status: 200,
        headers,
      });
    } else {
      // Create CSV content
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(field => 
          `"${String(field).replace(/"/g, '""')}"`
        ).join(','))
      ].join('\n');
      
      // Create response with CSV file
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename=feedback-export.csv',
        },
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export feedback', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
