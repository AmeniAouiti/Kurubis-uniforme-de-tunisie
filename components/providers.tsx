"use client";

import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { AuthProvider } from "@/contexts/auth-context";
import { AdminPreviewProvider } from "@/contexts/admin-preview-context";
import { CmsProvider } from "@/contexts/cms-context";
import { PlatformProvider } from "@/contexts/platform-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminPreviewProvider>
        <PlatformProvider>
          <CmsProvider>
            <CartProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </CartProvider>
          </CmsProvider>
        </PlatformProvider>
      </AdminPreviewProvider>
    </AuthProvider>
  );
}
