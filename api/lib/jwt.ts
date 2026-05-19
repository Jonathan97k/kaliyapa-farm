let secretKey: Uint8Array | null = null;

export function getSecret(): Uint8Array {
  if (secretKey) return secretKey;

  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'fallback-secret-change-in-production') {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  secretKey = new TextEncoder().encode(secret);
  return secretKey;
}

export async function createToken(payload: { id: string; email: string }): Promise<string> {
  const secret = getSecret();
  const { SignJWT } = await import('jose');
  return new SignJWT({ id: payload.id, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<{ id: string; email: string; exp?: number; iat?: number }> {
  const secret = getSecret();
  const { jwtVerify } = await import('jose');
  const { payload } = await jwtVerify(token, secret);
  return payload as { id: string; email: string; exp?: number; iat?: number };
}

export function getAdminEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('admin_email='))
    ?.split('=')[1] || null;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return document.cookie
    .split('; ')
    .some((row) => row.startsWith('admin_token='));
}
