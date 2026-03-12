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

/**
 * Mirrors the backend `nodeStatusChangeReasonEnum` exactly.
 * Keep in sync with: src/modules/node/dto/change-node-status.dto.ts
 */
export type NodeStatusChangeReason =
    | 'NORMAL_OPERATION'
    | 'MAINTENANCE'
    | 'SETUP_TEARDOWN'
    | 'MATERIAL_SHORTAGE'
    | 'BREAKDOWN'
    | 'QUALITY_ISSUE'
    | 'OPERATOR_BREAK'
    | 'OTHER';

export const NODE_STATUS_CHANGE_REASONS: { value: NodeStatusChangeReason; label: string }[] = [
    { value: 'NORMAL_OPERATION', label: 'Normal Operation' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'SETUP_TEARDOWN', label: 'Setup / Teardown' },
    { value: 'MATERIAL_SHORTAGE', label: 'Material Shortage' },
    { value: 'BREAKDOWN', label: 'Breakdown' },
    { value: 'QUALITY_ISSUE', label: 'Quality Issue' },
    { value: 'OPERATOR_BREAK', label: 'Operator Break' },
    { value: 'OTHER', label: 'Other' },
];

