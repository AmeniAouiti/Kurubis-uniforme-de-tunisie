export const SUPER_ADMIN = {
  email: "kurubis.uniforme@gmail.com",
  firstName: "raed",
  lastName: "khemir",
  defaultPassword: "Admin1234!",
} as const;

export function isSuperAdminEmail(email: string) {
  return email.toLowerCase() === SUPER_ADMIN.email.toLowerCase();
}
