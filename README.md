# Feedback Management System

A modern feedback collection and management dashboard built with Next.js 14 and TypeScript.

## Features

- **Feedback Collection**: User-friendly form for submitting feedback
- **Dashboard**: View and manage all feedback submissions
- **Analytics**: Visual representation of feedback data
- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Built-in dark and light themes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Styling**: TailwindCSS, ShadCN UI, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```env
   DATABASE_URL="your_database_connection_string"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Prompts

1. **Feedback Collection Form**
   Create a responsive feedback form with fields for name, email, rating, and comments. Include form validation and success/error messages.

2. **Feedback Dashboard**
   Build an admin dashboard to view, filter, and manage feedback submissions. Include sorting and search functionality.

3. **Analytics Dashboard**
   Implement data visualizatio to show feedback trends, ratings distribution, and response times.


5. **Export Functionality**
   Create an export feature to download feedback data in CSV or Excel format for further analysis.

## Deployment

Deploy your Next.js application on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) for the best experience.

## License

MIT
