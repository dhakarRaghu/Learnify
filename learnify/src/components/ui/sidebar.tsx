import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

interface SidebarBodyProps {
  children: ReactNode;
  className?: string;
}

interface SidebarLinkProps {
  link: {
    href: string;
    label: string;
    icon?: ReactNode;
  };
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <div
      className={cn(
        'w-16 hover:w-56 h-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-700 transition-all duration-300 ease-in-out group',
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarBody({ children, className }: SidebarBodyProps) {
  return (
    <div className={cn('p-2 flex flex-col h-full', className)}>
      {children}
    </div>
  );
}

export function SidebarLink({ link, className }: SidebarLinkProps) {
  return (
    <Link
      href={link.href}
      className={cn(
        'flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 w-10 group-hover:w-full overflow-hidden',
        className
      )}
    >
      {link.icon}
      <span className="hidden group-hover:block truncate">{link.label}</span>
    </Link>
  );
}