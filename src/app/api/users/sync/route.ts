import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { syncAuth0User } from '@/lib/user';

export async function POST() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const dbUser = await syncAuth0User(session.user);
    
    if (!dbUser) {
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: dbUser 
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}