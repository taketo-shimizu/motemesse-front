'use client';

import Header from '@/components/layout/Header';
import SideMenu from '@/components/layout/SideMenu';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: Props) {
  return (
    <div className="bg-gray-50 h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <SideMenu />

        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}