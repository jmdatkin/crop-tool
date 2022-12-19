import { defineStore } from "pinia";

export const useSelectionStore = defineStore('selection', {
    state: () => ({x: 0, y: 0, w: 0, h: 0}),

});