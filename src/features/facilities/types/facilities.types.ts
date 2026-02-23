export type FacilityListItem = {
  id: string;
  path: string;
  name: string;
  parentId?: string | null;
  definitionId?: string | null;
  capabilities?: string[];
  status?: string;
  attributes?: Record<string, any>;
  createdAt?: string;
};
