"use client";

import { Suspense } from "react";
import { AccountPage } from "@/components/account/account-page";
import { UserConversations } from "@/components/account/user-conversations";

export default function ConversationsPage() {
  return (
    <AccountPage title="Messagerie & devis" breadcrumb="Conversations">
      <Suspense>
        <UserConversations />
      </Suspense>
    </AccountPage>
  );
}
