export type FacilityListItem = {
    id: string;
    path: string;
    name: string;
    parentId?: string | null;
    definitionId?: string | null;
    capabilities?: string[];
    status?: string;
    type?: NodeType;
    attributes?: Record<string, any>;
    createdAt?: string;
};

/**
 * Mirrors the backend `nodeStatusChangeReasonEnum` exactly.
 * Keep in sync with: src/modules/node/dto/change-node-status.dto.ts
 */
export type NodeType = 'PRODUCTION' | 'WAREHOUSE' | 'LOGISTICS' | 'FACILITY' | 'QUALITY' | 'OTHER';

export const NODE_TYPES: { value: NodeType; label: string }[] = [
    { value: 'PRODUCTION', label: 'Production / Work Center' },
    { value: 'WAREHOUSE', label: 'Warehouse / Storage' },
    { value: 'LOGISTICS', label: 'Logistics / Transport' },
    { value: 'FACILITY', label: 'Facility / Plant' },
    { value: 'QUALITY', label: 'Quality / Inspection' },
    { value: 'OTHER', label: 'Other/Misc' },
];

export type NodeDefinition = {
    id: string;
    name: string;
    type: NodeType;
    attributes?: Record<string, any>;
};

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

