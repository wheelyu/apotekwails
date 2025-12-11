import {create} from "zustand";

interface SideBarState {
    isOpen: boolean;
    expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
    toggleSidebar: () => void
}
const useSideBarStore = create<SideBarState>((set) => ({
    isOpen: true,
    expandedSections: {},
    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    toggleSection: (sectionId: string) => 
        set((state) => ({
        expandedSections: {
            ...state.expandedSections,
            [sectionId]: !state.expandedSections[sectionId]
        }
        }))
    
}));

export default useSideBarStore