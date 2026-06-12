"use client";

import { AccountShell } from "@/components/account/account-shell";

export function AccountPage({
  title,
  breadcrumb,
  children,
}: {
  title: string;
  breadcrumb: string;
  children: React.ReactNode;
}) {
  return (
    <AccountShell title={title} breadcrumb={breadcrumb}>
      {children}
    </AccountShell>
  );
}
