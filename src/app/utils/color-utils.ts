import {Utils} from "./utils";

export class ColorUtils {
    static readonly defaultColorRange = {
        minHue: 0,
        maxHue: 120,
        minValue: 0,
        maxValue: 100
    };

    static readonly percentPassedColorRange = {
        minHue: 0,
        maxHue: 120,
        minValue: 50,
        maxValue: 100
    };

    static readonly averageGradeColorRange = {
        minHue: 0,
        maxHue: 120,
        minValue: 2,
        maxValue: 12
    };

    /**
     * Returns the hsl color string for the value using the specified color range.
     */
    static colorRangeToString(value: number, colorRange, defaultColor?: string) {
        if (!value) {
            return defaultColor;
        }

        const range = colorRange.maxHue - colorRange.minHue;

        // The processed value is the value after it is adjusted so that is offset by colorRange.startRangeAt
        let processedValue = Utils.clamp(value / colorRange.maxValue, 0, 1);

        if (colorRange.minValue !== 0) {
            processedValue = (value - colorRange.minValue) / (colorRange.maxValue - colorRange.minValue);
        }

        // The processed value is then scaled by the range, and added to the minimum hue to achieve the final hue value
        const hueOffset = processedValue * range;
        const hue = Utils.clamp(hueOffset + colorRange.minHue, colorRange.minHue, colorRange.maxHue);

        return `hsla(${hue}, 100%, 50%, 0.2)`;
    }
}
