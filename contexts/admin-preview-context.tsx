"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AdminPreviewContextType {
  sitePreview: boolean;
  enterSitePreview: () => void;
  exitSitePreview: () => void;
}

const AdminPreviewContext = createContext<AdminPreviewContextType | undefined>(
  undefined
);

const KEY = "kurubis-admin-preview";

export function AdminPreviewProvider({ children }: { children: ReactNode }) {
  const [sitePreview, setSitePreview] = useState(false);

  useEffect(() => {
    setSitePreview(sessionStorage.getItem(KEY) === "1");
  }, []);

  function enterSitePreview() {
    sessionStorage.setItem(KEY, "1");
    setSitePreview(true);
  }

  function exitSitePreview() {
    sessionStorage.removeItem(KEY);
    setSitePreview(false);
  }

  return (
    <AdminPreviewContext.Provider
      value={{ sitePreview, enterSitePreview, exitSitePreview }}
    >
      {children}
    </AdminPreviewContext.Provider>
  );
}

export function useAdminPreview() {
  const ctx = useContext(AdminPreviewContext);
  if (!ctx) throw new Error("useAdminPreview must be used within AdminPreviewProvider");
  return ctx;
}
