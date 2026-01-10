'use client';

import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export default function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {showHeader && <Header />}
      <main>{children}</main>
    </div>
  );
}
