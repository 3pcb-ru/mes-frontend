import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/shared/lib/api-client';

export interface VibePage {
    id: string;
    name: string;
    category: 'Main' | 'Operations' | 'Analytics' | 'Configuration' | 'Custom';
    config: any;
    isOwnerCreated: boolean;
    creatorId: string;
}

interface VibeState {
    pages: VibePage[];
    isGenerating: boolean;
    currentLayout: any | null;
    coolDownUntil: number | null;

    // Actions
    fetchPages: () => Promise<void>;
    generateLayout: (prompt: string, apiManifest: any, componentsManifest: any, currentConfig?: any) => Promise<void>;
    savePage: (name: string, category: VibePage['category']) => Promise<void>;
    updatePage: (id: string, data: Partial<VibePage>) => Promise<void>;
    deletePage: (id: string) => Promise<void>;
    setCoolDown: (seconds: number) => void;
}

export const useVibeStore = create<VibeState>()(
    persist(
        (set, get) => ({
            pages: [],
            isGenerating: false,
            currentLayout: null,
            coolDownUntil: null,

            fetchPages: async () => {
                try {
                    const pages = await apiClient.get<VibePage[]>('/vibe/pages');
                    set({ pages });
                } catch (error) {
                    console.error('Failed to fetch vibe pages:', error);
                }
            },

            generateLayout: async (prompt, apiManifest, componentsManifest, currentConfig) => {
                const { coolDownUntil } = get();
                if (coolDownUntil && coolDownUntil > Date.now()) {
                    const seconds = Math.ceil((coolDownUntil - Date.now()) / 1000);
                    const error = new Error('VIBE_COOLDOWN_ACTIVE');
                    (error as any).seconds = seconds;
                    throw error;
                }

                set({ isGenerating: true });
                try {
                    const layout = await apiClient.post<any>('/vibe/generate', {
                        prompt,
                        apiManifest,
                        componentsManifest,
                        currentConfig,
                    });
                    set({ currentLayout: layout });
                } catch (error: any) {
                    console.error('Failed to generate layout:', error);
                    const retryAfter = error?.response?.data?.retryAfter;
                    if (retryAfter) {
                        get().setCoolDown(retryAfter);
                    }
                    throw error;
                } finally {
                    set({ isGenerating: false });
                }
            },

            savePage: async (name, category) => {
                const { currentLayout } = get();
                if (!currentLayout) return;

                try {
                    const newPage = await apiClient.post<VibePage>('/vibe/pages', {
                        name,
                        category,
                        config: currentLayout,
                    });
                    set((state) => ({
                        pages: [...state.pages, newPage],
                        currentLayout: null,
                    }));
                } catch (error) {
                    console.error('Failed to save vibe page:', error);
                    throw error;
                }
            },

            updatePage: async (id, data) => {
                try {
                    const updatedPage = await apiClient.patch<VibePage>(`/vibe/pages/${id}`, data);
                    set((state) => ({
                        pages: state.pages.map((p) => (p.id === id ? updatedPage : p)),
                    }));
                } catch (error) {
                    console.error('Failed to update vibe page:', error);
                    throw error;
                }
            },

            deletePage: async (id) => {
                try {
                    await apiClient.delete(`/vibe/pages/${id}`);
                    set((state) => ({
                        pages: state.pages.filter((p) => p.id !== id),
                    }));
                } catch (error) {
                    console.error('Failed to delete vibe page:', error);
                }
            },

            setCoolDown: (seconds) => {
                set({ coolDownUntil: Date.now() + seconds * 1000 });
            },
        }),
        {
            name: 'mes-vibe-storage',
            partialize: (state) => ({ pages: state.pages }),
        },
    ),
);
