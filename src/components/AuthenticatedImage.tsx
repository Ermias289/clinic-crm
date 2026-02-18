// components/AuthenticatedImage.tsx
import { useState, useEffect } from 'react';
import { fileUploadService } from '@/lib/api/fileUpload';
import { Loader2 } from "lucide-react";

interface AuthenticatedImageProps {
  fileName: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  onError?: () => void;
  onLoad?: () => void;
}

export function AuthenticatedImage({ 
  fileName, 
  alt, 
  className = "", 
  fallback,
  onError,
  onLoad 
}: AuthenticatedImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        // Fetch the image as a blob with authentication
        const blob = await fileUploadService.getFile(fileName);
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setError(false);
        onLoad?.();
      } catch (err) {
        console.error('Error fetching image:', err);
        setError(true);
        onError?.();
      } finally {
        setLoading(false);
      }
    };

    if (fileName) {
      fetchImage();
    }

    // Cleanup function to revoke object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [fileName]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return fallback || null;
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
    />
  );
}