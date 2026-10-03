export const OWNER_EMAIL = 'devmarlow01@gmail.com';

export function isVerifiedOwner(user: { email: string | null; emailVerified: boolean } | null | undefined): boolean {
  return Boolean(user?.emailVerified && user.email?.toLowerCase() === OWNER_EMAIL);
}
