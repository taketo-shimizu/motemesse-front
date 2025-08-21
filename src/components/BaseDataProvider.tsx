'use client';

import { useEffect } from 'react';
import { useTargetsStore } from '@/store/targets';
import { useUserStore } from '@/store/user';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function BaseDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: userLoading } = useUser();
  const fetchTargets = useTargetsStore((state) => state.fetchTargets);
  const setSelectedTargetFromRecentTarget = useTargetsStore((state) => state.setSelectedTargetFromRecentTarget);
  const syncUser = useUserStore((state) => state.syncUser);

  useEffect(() => {
    // ユーザー情報が読み込まれて、ログインしている場合のみデータを取得
    if (!userLoading && user) {
      // ユーザー情報とターゲット情報を並行して取得
      Promise.all([
        syncUser(),
        fetchTargets()
      ]).then(() => {
        // ユーザー同期後、recent_target_idがある場合はselectedTargetIdに設定
        const currentUser = useUserStore.getState().user;
        if (currentUser?.recentTargetId) {
          setSelectedTargetFromRecentTarget(currentUser.recentTargetId);
        }
      }).catch(error => {
        console.error('Error initializing app data:', error);
      });
    }
  }, [user, userLoading, fetchTargets, syncUser, setSelectedTargetFromRecentTarget]);

  return <>{children}</>;
}