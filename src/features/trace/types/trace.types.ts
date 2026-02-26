export type ActivityListItem = {
    id: string;
    actionType: string;
    organizationId?: string;
    userId?: string;
    jobId?: string;
    nodeId?: string;
    sourceContainerId?: string;
    metadata?: Record<string, any>;
    createdAt?: string;
};
