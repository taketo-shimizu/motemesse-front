import { handleAuth } from '@auth0/nextjs-auth0';

// Next.js 15でdynamic routeのparamsはPromiseとして扱われる
const handler = handleAuth();

export async function GET(
  request: Request,
  context: { params: Promise<{ auth0: string }> }
) {
  // paramsをawaitして解決
  const params = await context.params;
  
  // handleAuthにリクエストとコンテキストを渡す
  return handler(request, { params });
}