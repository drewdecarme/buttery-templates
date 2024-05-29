import type {
  ButteryTokensColor,
  ButteryTokensColorPresets
} from "@buttery/core";
import { butteryConfigColorDefaultsPreset } from "@buttery/core/defaults";
import { produce } from "immer";
import { type ChangeEventHandler, type FC, useCallback } from "react";
import { ConfigColorSelectHues } from "./ConfigColorSelectHues";
import { ConfigColorSelectSaturationBrightness } from "./ConfigColorSelectSaturationBrightness";

export const ConfigColorModePresets: FC<{
  state: ButteryTokensColorPresets;
  setState: React.Dispatch<React.SetStateAction<ButteryTokensColor>>;
}> = ({ state, setState }) => {
  const handleChangePreset = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    ({ currentTarget: { value } }) => {
      const presetTone = value as ButteryTokensColorPresets["tone"];
      setState(
        produce((draft) => {
          if (draft.mode !== "presets") return;
          draft.tone = presetTone;
          draft.brightness =
            butteryConfigColorDefaultsPreset[presetTone].brightness;
          draft.saturation =
            butteryConfigColorDefaultsPreset[presetTone].saturation;
        })
      );
    },
    [setState]
  );

  return (
    <div>
      <label>
        <div>select a preset</div>
        <select defaultValue={state.tone} onChange={handleChangePreset}>
          {Object.keys(butteryConfigColorDefaultsPreset).map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>
      </label>
      <ConfigColorSelectSaturationBrightness />
      <div>
        <ConfigColorSelectHues />
      </div>
    </div>
  );
};
