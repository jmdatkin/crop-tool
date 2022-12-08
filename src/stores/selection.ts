import { defineStore } from "pinia";

export const useSelectionStore = defineStore('selection', {
    state: () => ({_x: 0, _y: 0, _w: 0, _h: 0}),
    getters: {
        x: state => state._x,
        y: state => state._y,
        w: state => state._w,
        h: state => state._h,

        pos: state => state
    },
    actions: {
        update(params) {
            if (typeof params.x !== 'undefined')
                this._x = params.x;
            if (typeof params.y !== 'undefined')
                this._y = params.y;
            if (typeof params.w !== 'undefined')
                this._w = params.w;
            if (typeof params.h !== 'undefined')
                this._h = params.h;
        },
    }
    
});