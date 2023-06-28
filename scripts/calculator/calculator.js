import clamp from 'lodash/clamp';

import {easeLinear} from './easings';

/**
 * @typedef {function(x: number): number} Calculator
 *
 * @typedef {{
 *   xRange: [minX: number, maxX: number],
 *   yRange: [startX: number, endX: number],
 *   onProgress: Easing,
 * }} CalculatorRange - assert(minX <= maxX)
 */

const {PI, min, max, sin, cos, atan} = Math;

const HALF_CIRCLE_DEGREES = 180;
const MAX_PROGRESS = 1;
const DEFAULT_X_RANGE = [0, 1];
const DEFAULT_Y_RANGE = [0, 1];

export const convertDegreesToRadians = (degrees) => degrees * PI / HALF_CIRCLE_DEGREES;
export const convertRadiansToDegrees = (radians) => radians * HALF_CIRCLE_DEGREES / PI;
export const convertTangentToDegrees = (tangent) => convertRadiansToDegrees(atan(tangent));

export const calculateTangentY1 = (x0, y0, x1, dy0) => dy0 * (x1 - x0) + y0;

export const rotatePoint = ([x, y], degrees = 0) => {
  const radians = convertDegreesToRadians(degrees);
  const cosinus = cos(radians);
  const sinus = sin(radians);
  return [
    x * cosinus - y * sinus,
    x * sinus + y * cosinus,
  ];
};

/**
 * @param {CalculatorRange} arguments
 * @return {Calculator}
 */
export const createCalculator = ({
  xRange: [minX, maxX] = DEFAULT_X_RANGE,
  yRange: [startY, endY] = DEFAULT_Y_RANGE,
  onProgress = easeLinear,
}) => {
  if (!(minX <= maxX)) {
    throw new Error(`createCalculator(): minX (${minX}) shall not be more than maxX (${maxX})`);
  }
  return (x) => {
    x = clamp(x, minX, maxX);
    const progress = (x - minX) / (maxX - minX);
    const y = startY + (endY - startY) * onProgress(Number.isFinite(progress) ? progress : MAX_PROGRESS);
    return clamp(y, min(startY, endY), max(startY, endY));
  };
};

/**
 * @param {CalculatorRange[]} ranges
 * @return {Calculator}
 */
export const createCompositeCalculator = (ranges) => {
  let compositeMinX = +Infinity;
  let compositeMaxX = -Infinity;
  ranges.forEach(({xRange: [minX, maxX], yRange}, i) => {
    if (!(minX <= maxX)) {
      throw new Error(`createCompositeCalculator(): minX (${minX}) shall not be more than maxX (${maxX}) in #${i + 1}/${ranges.length}`);
    }

    compositeMinX = min(compositeMinX, minX);
    compositeMaxX = max(compositeMaxX, maxX);

    if (yRange.length === 1) {
      yRange.push(yRange[0]);
    }
  });

  return (x) => {
    x = clamp(x, compositeMinX, compositeMaxX);

    const currentRange = ranges.find(({xRange: [currentMinX]}, i) => {
      const nextMinX = i === ranges.length - 1
        ? +Infinity
        : ranges[i + 1].xRange[0];

      return currentMinX <= x && x < nextMinX;
    });

    const {
      xRange: [minX, maxX] = DEFAULT_X_RANGE,
      yRange: [startY, endY] = DEFAULT_Y_RANGE,
      onProgress = easeLinear,
    } = currentRange;

    x = clamp(x, minX, maxX);
    const progress = (x - minX) / (maxX - minX);
    const y = startY + (endY - startY) * onProgress(Number.isFinite(progress) ? progress : MAX_PROGRESS);
    return clamp(y, min(startY, endY), max(startY, endY));
  };
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} amplitude
 * @return {{
 *   calculateY: (function(progress: number): number ),
 *   calculateTangent: (function(progress: number): number),
 * }}
 */
export const createSinusCalculator = ({x, y, width, height, amplitude}) => {
  const ratio = 2 * PI / amplitude;
  return {
    calculateY: (progress) => height / 2 * sin(ratio * (width * progress + x)) + y,
    calculateTangent: (progress) => height / 2 * ratio * cos(ratio * (width * progress + x)),
  };
};
