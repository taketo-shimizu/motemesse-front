'use client';

import Header from '@/components/layout/Header';
import SideMenu from '@/components/layout/SideMenu';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function DefaultLayout({ children }: Props) {
  return (
    <div className="bg-gray-50">
      <Header />
      <SideMenu />
      <main>
        {children}
      </main>
    </div>
  );
}