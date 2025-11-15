'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';

export function ExportButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/export?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-export.${format}`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport('csv')}
        disabled={isLoading}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {isLoading ? 'Exporting...' : 'Export CSV'}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport('excel')}
        disabled={isLoading}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {isLoading ? 'Exporting...' : 'Export Excel'}
      </Button>
    </div>
  );
}
