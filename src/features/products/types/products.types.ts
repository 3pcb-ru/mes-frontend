export type ProductListItem = {
  id: string;
  sku?: string;
  name: string;
  factoryId?: string;
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow additional fields from backend
};
