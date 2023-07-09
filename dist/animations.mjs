const EPSILON = 1e-6;
const NEWTON_ITERATIONS = 8;
class BezierEasing {
  /**
   * Create a unit cubic Bézier curve from the two middle control points.
   *
   * X coordinate is time, Y coordinate is function advancement.
   * The nominal range for both is 0 to 1.
   *
   * The start and end points are always (0, 0) and (1, 1) so that a transition or animation starts at 0% and ends at 100%.
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  constructor(x1, y1, x2, y2) {
    this.cx = 3 * x1;
    this.bx = 3 * (x2 - x1) - this.cx;
    this.ax = 1 - this.cx - this.bx;
    this.cy = 3 * y1;
    this.by = 3 * (y2 - y1) - this.cy;
    this.ay = 1 - this.cy - this.by;
    this.css = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
    this.toString = this.toString.bind(this);
    this.solve = this.solve.bind(this);
    this.solve.toString = this.toString;
  }
  /**
   * Solve the bezier curve for a given `x`.
   *
   * @param {number} x
   * @return {number}
   */
  solve(x) {
    return this._sampleY(this._solveX(x));
  }
  /**
   * Return css counterpart of a curve.
   *
   * @return {string}
   */
  toString() {
    return this.css;
  }
  _sampleX(t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  }
  _sampleY(t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  }
  _sampleDerivativeX(t) {
    return (3 * this.ax * t + 2 * this.bx) * t + this.cx;
  }
  _solveX(x) {
    for (let t2 = x, _ = 0; _ < NEWTON_ITERATIONS; _++) {
      const x2 = this._sampleX(t2) - x;
      if (Math.abs(x2) < EPSILON) {
        return t2;
      }
      const dx = this._sampleDerivativeX(t2);
      if (Math.abs(dx) < EPSILON) {
        break;
      }
      t2 -= x2 / dx;
    }
    let lo = 0;
    let hi = 1;
    let t = x;
    if (t < lo) {
      return lo;
    }
    if (t > hi) {
      return hi;
    }
    while (lo < hi) {
      const x2 = this._sampleX(t);
      if (Math.abs(x2 - x) < EPSILON) {
        return t;
      }
      if (x > x2) {
        lo = t;
      } else {
        hi = t;
      }
      t = (hi - lo) / 2 + lo;
    }
    return t;
  }
}
const createBezierEasing = (x1, y1, x2, y2) => new BezierEasing(x1, y1, x2, y2).solve;

var __pow = Math.pow;
const { PI: PI$1, sin: sin$1, cos: cos$1, acos } = Math;
const easeLinear = (x) => x;
const easeInQuad = (x) => x * x;
const easeInCubic = (x) => x * x * x;
const easeInExpo = (x) => x === 0 ? x : __pow(2, 10 * x - 10);
const easeInElastic = (x) => x === 0 || x === 1 ? x : __pow(2, 10 * x - 10) * sin$1(x * 10 - 10.75) * 2 * PI$1 / 3;
const easeOutQuad = (x) => 1 - __pow(1 - x, 2);
const easeOutCubic = (x) => 1 - __pow(1 - x, 3);
const easeOutExpo = (x) => 1 - __pow(2, -10 * x);
const easeOutElastic = (x) => x === 0 || x === 1 ? x : __pow(2, -10 * x) * sin$1(x * 10 - 0.75) * 2 * PI$1 / 3 + 1;
const createPower = (power) => (x) => __pow(x, power);
const createBack = (elasticity) => (x) => __pow(x, 2) * ((elasticity + 1) * x - elasticity);
const bounce = (x) => {
  x = x < 0 ? 0 : x;
  for (let a = 0, b = 1; ; a += b, b /= 2) {
    if (x >= (7 - 4 * a) / 11) {
      return -__pow((11 - 6 * a - 11 * x) / 4, 2) + __pow(b, 2);
    }
  }
};
const createElastic = (segment) => (x) => __pow(2, 10 * (x - 1)) * cos$1(20 * PI$1 * segment / 3 * x);
const calculateCirc = (x) => 1 - sin$1(acos(x));
const convertToEaseOut = (onEase = easeLinear, speed = 1) => {
  return (t) => {
    return speed - onEase(speed * (1 - t));
  };
};
const convertToEaseInOut = (onEase = easeLinear) => {
  const onEaseOut = convertToEaseOut(onEase, 2);
  return (t) => {
    return t < 0.5 ? onEase(2 * t) / 2 : onEaseOut(t) / 2;
  };
};
const convertToEaseOutIn = (onEase = easeLinear) => {
  const onEaseOut = convertToEaseOut(onEase);
  return (t) => {
    return t < 0.5 ? onEaseOut(2 * t) / 2 : (onEase(2 * t - 1) + 1) / 2;
  };
};
const ease = createBezierEasing(0.25, 0.1, 0.25, 1);
const easeIn = createBezierEasing(0.42, 0, 1, 1);
const easeOut = createBezierEasing(0, 0, 0.58, 1);
const easeInOut = createBezierEasing(0.42, 0, 0.58, 1);
const easeOutIn = convertToEaseOutIn(easeIn);
const easeInOutSine = createBezierEasing(0.37, 0, 0.63, 1);
const easeSine = (value, onEase) => onEase((value + 1) / 2) * 2 - 1;

const SECOND = 1e3;
const PLAYBACK_RATE = 1;
const MAX_PROGRESS$1 = 1;
const MAX_PROGRESS_WITH_ALTERNATION = 2 * MAX_PROGRESS$1;
const TIME_ORIGIN = Date.now() - Math.trunc(performance.now());
const calculateElapsed = (currentTimestamp, startTimestamp, delay) => {
  return Math.max(0, (currentTimestamp - (startTimestamp + delay)) * PLAYBACK_RATE);
};
const calculateProgress = (elapsed, duration, shouldAlternate) => {
  const rawProgress = Math.max(0, elapsed / duration);
  if (!shouldAlternate) {
    return Math.min(rawProgress, MAX_PROGRESS$1);
  }
  const constraintProgress = rawProgress === MAX_PROGRESS_WITH_ALTERNATION ? MAX_PROGRESS_WITH_ALTERNATION : rawProgress % MAX_PROGRESS_WITH_ALTERNATION;
  return constraintProgress > MAX_PROGRESS$1 ? MAX_PROGRESS_WITH_ALTERNATION - constraintProgress : Math.min(constraintProgress, MAX_PROGRESS$1);
};
const calculateIteration = (elapsed, duration) => {
  return Math.max(0, Math.floor(elapsed / duration));
};
const calculateIterationProgress = (elapsed, duration) => {
  return elapsed % duration / duration;
};
const calculateFrameId = (fps, progress, duration) => {
  return Math.trunc(progress * duration / SECOND * fps);
};
const calculateAnimationDuration = (fps, framesCount) => {
  return Math.ceil(SECOND / fps * (framesCount - 1));
};
class FrameAnimation {
  /**
   * @param {string} [name]
   * @param {boolean} [shouldPreloadFirstFrame]
   * @param {boolean} [shouldAlternate]
   * @param {boolean} [shouldSkipDuplicates]
   * @param {number} [delay]
   * @param {number} [duration]
   * @param {number} [fps]
   * @param {any[]} [frames]
   * @param {any} [userState]
   * @param {Easing} [onProgress]
   * @param {function} [onRenderFrame]
   */
  constructor({
    name = String(performance.now()),
    shouldPreloadFirstFrame = true,
    shouldAlternate = false,
    shouldSkipDuplicates = true,
    delay = 0,
    duration,
    fps = 60,
    frames,
    userState,
    onProgress = easeLinear,
    onRenderFrame
  }) {
    this._name = name;
    this._shouldPreloadFirstFrame = shouldPreloadFirstFrame;
    this._shouldAlternate = shouldAlternate;
    this._shouldSkipDuplicates = shouldSkipDuplicates;
    this._delay = delay / PLAYBACK_RATE;
    this._fps = fps;
    this._frames = frames;
    this._onProgress = onProgress;
    this._onRenderFrame = onRenderFrame;
    if (duration === Infinity) {
      this._duration = Number.MAX_SAFE_INTEGER;
    } else if (!duration) {
      this._duration = calculateAnimationDuration(fps, frames.length);
    } else {
      this._duration = duration;
    }
    this._delayTimer = 0;
    this._startTimestamp = 0;
    this._isFirstFrameRendered = false;
    this._latestAnimationFrameId = 0;
    this._latestRenderState = null;
    this._userState = userState;
    this._onScheduleFrame = this._onScheduleFrame.bind(this);
    this._onDelayFrame = this._onDelayFrame.bind(this);
    this._onRerenderFrame = this._onRerenderFrame.bind(this);
    this._onFrame = this._onFrame.bind(this);
  }
  setState(state) {
    this._userState = this._userState || {};
    this._userState.state = state;
  }
  getStartTimestamp() {
    return this._startTimestamp;
  }
  hasStarted() {
    return this.getStartTimestamp() > 0;
  }
  restart(startTimestamp = Date.now()) {
    this.stop();
    this.start(startTimestamp);
  }
  start(startTimestamp = Date.now()) {
    if (this.hasStarted()) {
      return;
    }
    this._startTimestamp = startTimestamp;
    this._isFirstFrameRendered = false;
    if (this._shouldPreloadFirstFrame) {
      this._onFrame(performance.now(), false, false);
    }
    this._delayTimer = setTimeout(this._onDelayFrame, this._delay);
  }
  stop() {
    this._startTimestamp = 0;
    this._isFirstFrameRendered = false;
    if (this._delayTimer > 0) {
      clearTimeout(this._delayTimer);
      this._delayTimer = 0;
    }
    if (this._latestAnimationFrameId > 0) {
      cancelAnimationFrame(this._latestAnimationFrameId);
      this._latestAnimationFrameId = 0;
      this._latestRenderState = null;
      this._startTimestamp = 0;
    }
  }
  rerenderIfActive() {
    if (!this.hasStarted() || this._latestAnimationFrameId > 0 || this._delayTimer > 0) {
      return;
    }
    this._latestAnimationFrameId = requestAnimationFrame(this._onRerenderFrame);
  }
  _onFrame(performanceNow, shouldRequestNextFrameIfNeeded, shouldSkipDuplicates) {
    const currentTimestamp = this._isFirstFrameRendered ? TIME_ORIGIN + Math.trunc(performanceNow) : this._startTimestamp;
    const elapsed = calculateElapsed(currentTimestamp, this._startTimestamp, this._delay);
    const iteration = calculateIteration(elapsed, this._duration);
    const progress = this._onProgress(calculateProgress(elapsed, this._duration, this._shouldAlternate));
    const renderFrameId = calculateFrameId(this._fps, progress, this._duration);
    if (this._shouldSkipDuplicates && shouldSkipDuplicates) {
      if (this._latestRenderState && this._latestRenderState.frameId === renderFrameId) {
        if (shouldRequestNextFrameIfNeeded) {
          this._latestAnimationFrameId = requestAnimationFrame(this._onScheduleFrame);
        }
        return;
      }
    }
    this._latestRenderState = {
      performanceNow,
      duration: this._duration,
      elapsed,
      iteration,
      progress,
      regress: 1 - progress,
      frameId: renderFrameId,
      frame: this._frames ? this._frames[renderFrameId] : void 0
    };
    const canContinue = this._onRenderFrame(this._latestRenderState, this._userState) !== false;
    this._isFirstFrameRendered = true;
    if (canContinue) {
      if (progress < MAX_PROGRESS$1 || this._shouldAlternate) {
        if (shouldRequestNextFrameIfNeeded) {
          this._latestAnimationFrameId = requestAnimationFrame(this._onScheduleFrame);
        }
        return;
      }
    }
    this._latestAnimationFrameId = 0;
  }
  _onDelayFrame() {
    this._delayTimer = 0;
    this._onFrame(performance.now(), true, true);
  }
  _onScheduleFrame(performanceNow) {
    this._onFrame(performanceNow, true, true);
  }
  _onRerenderFrame(performanceNow) {
    this._onFrame(performanceNow, false, false);
  }
}

const ensureImage = (imageOrSource) => {
  if (imageOrSource instanceof HTMLImageElement) {
    return imageOrSource;
  }
  const image = new Image();
  image.src = imageOrSource;
  return image;
};
class ImagesCompleteListener {
  /**
   * @param {Array<HTMLImageElement>} images
   * @param {function(ImagesCompleteListener): void} onComplete
   */
  constructor({ images, onComplete }) {
    this._images = images.map(ensureImage);
    this._onComplete = onComplete;
    this._incompleteImages = /* @__PURE__ */ new Set();
    this._isActive = false;
    this._removeImageListeners = this._removeImageListeners.bind(this);
    this._onImageLoad = this._onImageLoad.bind(this);
    this._onImageError = this._onImageError.bind(this);
  }
  getImages() {
    return this._images;
  }
  isActive() {
    return this._isActive;
  }
  activate() {
    this._isActive = true;
    this._images.forEach((image) => {
      if (!image.complete) {
        this._addImageListeners(image);
        this._incompleteImages.add(image);
      }
    });
    this._notifyCompleteIfNeeded();
    return this;
  }
  deactivate() {
    this._incompleteImages.forEach(this._removeImageListeners);
    this._incompleteImages.clear();
    this._isActive = false;
    return this;
  }
  _notifyCompleteIfNeeded() {
    if (this._incompleteImages.size === 0 && this._isActive) {
      Promise.resolve().then(() => {
        if (this._isActive) {
          this._isActive = false;
          this._onComplete(this);
        }
      });
    }
  }
  _completeImage(image) {
    this._removeImageListeners(image);
    this._incompleteImages.delete(image);
    this._notifyCompleteIfNeeded();
  }
  _addImageListeners(image) {
    image.addEventListener(`load`, this._onImageLoad, { once: true });
    image.addEventListener(`error`, this._onImageError, { once: true });
  }
  _removeImageListeners(image) {
    image.removeEventListener(`load`, this._onImageLoad);
    image.removeEventListener(`error`, this._onImageError);
  }
  _onImageLoad(evt) {
    this._completeImage(evt.currentTarget);
  }
  _onImageError(evt) {
    this._completeImage(evt.currentTarget);
  }
}

const getLetterHTML = (letter) => {
  return letter.replace(` `, `&nbsp;`).replace(`<`, `&lt;`);
};
const applyAccentTypography = (element, lineClassName = `accent-line`) => {
  var _a;
  if (!element) {
    return;
  }
  element.innerHTML = ((_a = element.textContent) != null ? _a : ``).trim().split(`
`).map((line) => line.trim()).filter(Boolean).map((line) => {
    return `
        <span class="${lineClassName}">
            ${Array.from(line).map((letter) => `<span>${getLetterHTML(letter)}</span>`).join(``)}
        </span>
      `;
  }).join(``);
};

const clamp = (value, min, max) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

const { PI, min, max, sin, cos, atan } = Math;
const HALF_CIRCLE_DEGREES = 180;
const MAX_PROGRESS = 1;
const DEFAULT_X_RANGE = [0, 1];
const DEFAULT_Y_RANGE = [0, 1];
const convertDegreesToRadians = (degrees) => degrees * PI / HALF_CIRCLE_DEGREES;
const convertRadiansToDegrees = (radians) => radians * HALF_CIRCLE_DEGREES / PI;
const convertTangentToDegrees = (tangent) => convertRadiansToDegrees(atan(tangent));
const calculateTangentY1 = (x0, y0, x1, dy0) => dy0 * (x1 - x0) + y0;
const rotatePoint = ([x, y], degrees = 0) => {
  const radians = convertDegreesToRadians(degrees);
  const cosinus = cos(radians);
  const sinus = sin(radians);
  return [
    x * cosinus - y * sinus,
    x * sinus + y * cosinus
  ];
};
const createCalculator = ({
  xRange: [minX, maxX] = DEFAULT_X_RANGE,
  yRange: [startY, endY] = DEFAULT_Y_RANGE,
  onProgress = easeLinear
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
const createCompositeCalculator = (ranges) => {
  let compositeMinX = Infinity;
  let compositeMaxX = -Infinity;
  ranges.forEach(({ xRange: [minX, maxX], yRange }, i) => {
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
    const currentRange = ranges.find(({ xRange: [currentMinX] }, i) => {
      const nextMinX = i === ranges.length - 1 ? Infinity : ranges[i + 1].xRange[0];
      return currentMinX <= x && x < nextMinX;
    });
    const {
      xRange: [minX, maxX] = DEFAULT_X_RANGE,
      yRange: [startY, endY] = DEFAULT_Y_RANGE,
      onProgress = easeLinear
    } = currentRange;
    x = clamp(x, minX, maxX);
    const progress = (x - minX) / (maxX - minX);
    const y = startY + (endY - startY) * onProgress(Number.isFinite(progress) ? progress : MAX_PROGRESS);
    return clamp(y, min(startY, endY), max(startY, endY));
  };
};
const createSinusCalculator = ({ x, y, width, height, amplitude }) => {
  const ratio = 2 * PI / amplitude;
  return {
    calculateY: (progress) => height / 2 * sin(ratio * (width * progress + x)) + y,
    calculateTangent: (progress) => height / 2 * ratio * cos(ratio * (width * progress + x))
  };
};

export { FrameAnimation, ImagesCompleteListener, applyAccentTypography, bounce, calculateCirc, calculateIteration, calculateIterationProgress, calculateTangentY1, convertDegreesToRadians, convertRadiansToDegrees, convertTangentToDegrees, convertToEaseInOut, convertToEaseOut, convertToEaseOutIn, createBack, createCalculator, createCompositeCalculator, createElastic, createPower, createSinusCalculator, ease, easeIn, easeInCubic, easeInElastic, easeInExpo, easeInOut, easeInOutSine, easeInQuad, easeLinear, easeOut, easeOutCubic, easeOutElastic, easeOutExpo, easeOutIn, easeOutQuad, easeSine, getLetterHTML, rotatePoint };
