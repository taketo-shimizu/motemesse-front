'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTargetsStore } from '@/store/targets';
import { useUserStore } from '@/store/user';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter, usePathname } from 'next/navigation';

export default function BaseDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: userLoading } = useUser();
  const setSelectedTargetFromRecentTarget = useTargetsStore((state) => state.setSelectedTargetFromRecentTarget);
  const syncUser = useUserStore((state) => state.syncUser);
  const router = useRouter();
  const pathname = usePathname();

  // 初期化済みかどうかを追跡
  const isInitialized = useRef(false);

  // 初期化処理を安定化
  const initializeApp = useCallback(async () => {
    if (isInitialized.current) return;
    if (userLoading || !user) return;

    console.log('BaseDataProvider useEffect');
    isInitialized.current = true;

    try {
      await syncUser();
      const currentUser = useUserStore.getState().user;

      // プロフィールが未完成の場合はuser-settingページにリダイレクト
      if (currentUser && (!currentUser.name || !currentUser.age)) {
        // すでにuser-settingページにいる場合はリダイレクトしない
        if (pathname !== '/user-setting') {
          router.push('/user-setting');
          return;
        }
      }

      if (currentUser?.recentTargetId) {
        setSelectedTargetFromRecentTarget(currentUser.recentTargetId);
      }
    } catch (error) {
      console.error('Error initializing app data:', error);
      isInitialized.current = false;
    }
  }, [user, userLoading, syncUser, pathname, router, setSelectedTargetFromRecentTarget]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return <>{children}</>;
}