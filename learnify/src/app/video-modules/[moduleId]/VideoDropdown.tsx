'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Video {
  id: string;
  name: string;
  videoId: string;
  summary?: string;
}

interface VideoDropdownProps {
  videos: Video[];
  moduleId: string;
  currentVideoIndex: number;
}

export default function VideoDropdown({ videos, moduleId, currentVideoIndex }: VideoDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (index: number) => {
    setIsOpen(false);
    router.push(`/video-modules/${moduleId}?videoIndex=${index}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted text-sm font-medium text-muted-foreground hover:bg-muted/80 w-52 justify-between"
      >
        <span className="truncate flex-1 text-left">
          {videos[currentVideoIndex]?.name || 'Select a video'}
        </span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md shadow-lg z-10">
          <div className="max-h-56 overflow-y-auto">
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => handleSelect(index)}
                className={cn(
                  'w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800',
                  currentVideoIndex === index && 'bg-accent text-accent-foreground'
                )}
              >
                <span className="truncate">{video.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}