export type ContainerListItem = {
    id: string;
    lpn: string;
    organizationId?: string;
    locationNodeId?: string | null;
    type?: string;
    createdAt?: string;
};
