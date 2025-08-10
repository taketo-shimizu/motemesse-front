import { prisma } from './prisma';
import { CreateUserData, DatabaseUser, Auth0SessionUser } from '@/types/auth';

/**
 * ユーザーをメールアドレスで検索
 */
export async function findUserByEmail(email: string): Promise<DatabaseUser | null> {
  try {
    return await prisma.user.findUnique({
      where: { email }
    });
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

/**
 * ユーザーをAuth0 IDで検索
 */
export async function findUserByAuth0Id(auth0Id: string): Promise<DatabaseUser | null> {
  try {
    return await prisma.user.findUnique({
      where: { auth0Id }
    });
  } catch (error) {
    console.error('Error finding user by Auth0 ID:', error);
    return null;
  }
}

/**
 * 新しいユーザーを作成
 */
export async function createUser(userData: CreateUserData): Promise<DatabaseUser | null> {
  try {
    return await prisma.user.create({
      data: userData
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

/**
 * ユーザー情報を更新
 */
export async function updateUser(id: number, userData: Partial<CreateUserData>): Promise<DatabaseUser | null> {
  try {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

/**
 * Auth0ユーザーをデータベースと同期
 * 存在しない場合は作成、存在する場合は更新
 */
export async function syncAuth0User(auth0User: Auth0SessionUser): Promise<DatabaseUser | null> {
  if (!auth0User.email) return null;

  try {
    // Auth0 IDで検索（優先）
    let dbUser = null;
    if (auth0User.sub) {
      dbUser = await findUserByAuth0Id(auth0User.sub);
    }

    // Auth0 IDで見つからない場合はメールで検索
    if (!dbUser) {
      dbUser = await findUserByEmail(auth0User.email);
    }

    const userData: CreateUserData = {
      email: auth0User.email,
      name: auth0User.name || null,
      auth0Id: auth0User.sub || null,
      picture: auth0User.picture || null,
      emailVerified: auth0User.email_verified || false
    };

    if (dbUser) {
      // 既存ユーザーを更新（メールアドレスが変更された場合も考慮）
      const updateData: Partial<CreateUserData> = {
        name: userData.name,
        picture: userData.picture,
        emailVerified: userData.emailVerified
      };

      // メールアドレスが変更された場合は更新
      if (dbUser.email !== userData.email) {
        updateData.email = userData.email;
      }

      // Auth0 IDが未設定の場合は更新
      if (!dbUser.auth0Id && userData.auth0Id) {
        updateData.auth0Id = userData.auth0Id;
      }

      return await updateUser(dbUser.id, updateData);
    } else {
      // 新規ユーザーを作成
      return await createUser(userData);
    }
  } catch (error) {
    console.error('Error syncing Auth0 user:', error);
    return null;
  }
}