import type { NodeType } from '@/features/facilities/types/facilities.types';

/**
 * Shared utility to determine a node's type from its name or path
 * using industrial keywords.
 */
export const getNodeType = (searchStr?: string): NodeType => {
    const s = (searchStr || '').toLowerCase();
    
    if (s.includes('factory') || s.includes('plant') || s.includes('building')) {
        return 'FACILITY';
    }
    
    if (
        s.includes('area') || 
        s.includes('line') || 
        s.includes('station') || 
        s.includes('cell') || 
        s.includes('workcenter') || 
        s.includes('production') || 
        s.includes('prod')
    ) {
        return 'PRODUCTION';
    }
    
    if (
        s.includes('warehouse') || 
        s.includes('storage') || 
        s.includes('inventory') || 
        s.includes('shelf') || 
        s.includes('bin') || 
        s.includes('rack')
    ) {
        return 'WAREHOUSE';
    }
    
    if (s.includes('qc') || s.includes('quality') || s.includes('inspection')) {
        return 'QUALITY';
    }
    
    if (s.includes('dock') || s.includes('shipping') || s.includes('receiving') || s.includes('logistic')) {
        return 'LOGISTICS';
    }
    
    return 'OTHER';
};
