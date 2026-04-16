import { type FacilityListItem, type NodeDefinition, type NodeStatusChangeReason, type NodeType } from './facilities.schema';

export type { FacilityListItem, NodeDefinition, NodeStatusChangeReason, NodeType };

/**
 * UI Constants for Facilities
 */

export const NODE_TYPES: { value: NodeType; label: string }[] = [
    { value: 'PRODUCTION', label: 'Production / Work Center' },
    { value: 'WAREHOUSE', label: 'Warehouse / Storage' },
    { value: 'LOGISTICS', label: 'Logistics / Transport' },
    { value: 'FACILITY', label: 'Facility / Plant' },
    { value: 'QUALITY', label: 'Quality / Inspection' },
    { value: 'OTHER', label: 'Other/Misc' },
];

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
