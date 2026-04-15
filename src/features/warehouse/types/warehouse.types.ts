export type ContainerListItem = {
    id: string;
    lpn: string;
    organizationId?: string;
    locationNodeId?: string | null;
    type?: string;
    createdAt?: string;
};

export type CreateContainerDto = {
    lpn: string;
    item: string;
    quantity: number;
    source: string;
    expectedDate?: string;
    actualDate?: string;
    type?: string;
    locationNodeId?: string;
};

export type MoveContainerDto = {
    targetNodeId: string;
    userId?: string;
};
