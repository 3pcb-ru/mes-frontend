/**
 * Module Actions Configuration
 * Define which CRUD actions are available for each module
 * Set to false if the API doesn't support that action
 */

export const MODULE_ACTIONS_CONFIG = {
    products: {
        canEdit: true,
        canDelete: true,
    },
    facilities: {
        canEdit: true,
        canDelete: true,
    },
    trace: {
        canEdit: true,
        canDelete: true,
    },
    inventory: {
        canEdit: true,
        canDelete: true,
    },
    workOrders: {
        canEdit: true,
        canDelete: true,
    },
} as const;

export type ModuleKey = keyof typeof MODULE_ACTIONS_CONFIG;

export function getModuleActions(module: ModuleKey) {
    return MODULE_ACTIONS_CONFIG[module];
}

export function hasAnyActions(module: ModuleKey): boolean {
    const actions = MODULE_ACTIONS_CONFIG[module];
    return actions.canEdit || actions.canDelete;
}
