export type ContainerListItem = {
  id: string;
  lpn: string;
  tenantId?: string;
  locationNodeId?: string | null;
  type?: string;
  createdAt?: string;
};
