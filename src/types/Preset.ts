import type { SelectMode } from "./SelectModeOptions";

type FixedRatioSettings = {
    width: number,
    height: number
};

type FixedSizeSettings = {
    width: number,
    height: number
};

type Preset = {
    selectMode: SelectMode,
    selectModeParams: FixedRatioSettings | FixedSizeSettings | null,
    outputWidth: number,
    outputHeight: number,

};

export default Preset;