export interface UserAddress {
  id: string;
  userId: string;
  type: "billing" | "shipping";
  label?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function mapAddressRow(row: Record<string, unknown>): UserAddress {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as UserAddress["type"],
    label: (row.label as string) || undefined,
    street: row.street as string,
    city: row.city as string,
    postalCode: row.postal_code as string,
    country: row.country as string,
    phone: (row.phone as string) || undefined,
    isDefault: row.is_default as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function addressToRow(
  addr: Partial<UserAddress> & { type: UserAddress["type"]; street: string; city: string; postalCode: string },
  userId: string
) {
  return {
    user_id: userId,
    type: addr.type,
    label: addr.label || null,
    street: addr.street,
    city: addr.city,
    postal_code: addr.postalCode,
    country: addr.country || "Tunisie",
    phone: addr.phone || null,
    is_default: addr.isDefault ?? false,
    updated_at: new Date().toISOString(),
  };
}
