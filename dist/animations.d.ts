declare function calculateIteration(elapsed: any, duration: any): number;
declare function calculateIterationProgress(elapsed: any, duration: any): number;
declare class FrameAnimation {
    constructor({ name, shouldPreloadFirstFrame, shouldAlternate, shouldSkipDuplicates, delay, duration, fps, frames, userState, onProgress, onRenderFrame, }?: string | undefined);
    _name: any;
    _shouldPreloadFirstFrame: any;
    _shouldAlternate: any;
    _shouldSkipDuplicates: any;
    _delay: number;
    _fps: any;
    _frames: any;
    _onProgress: any;
    _onRenderFrame: any;
    _duration: any;
    _delayTimer: number;
    _startTimestamp: number;
    _isFirstFrameRendered: boolean;
    _latestAnimationFrameId: number;
    _latestRenderState: any;
    _userState: any;
    _onScheduleFrame(performanceNow: any): void;
    _onDelayFrame(): void;
    _onRerenderFrame(performanceNow: any): void;
    _onFrame(performanceNow: any, shouldRequestNextFrameIfNeeded: any, shouldSkipDuplicates: any): void;
    setState(state: any): void;
    getStartTimestamp(): number;
    hasStarted(): boolean;
    restart(startTimestamp?: number): void;
    start(startTimestamp?: number): void;
    stop(): void;
    rerenderIfActive(): void;
}

declare class ImagesCompleteListener {
    constructor({ images, onComplete }: Array<HTMLImageElement>);
    _images: any;
    _onComplete: any;
    _incompleteImages: Set<any>;
    _isActive: boolean;
    _removeImageListeners(image: any): void;
    _onImageLoad(evt: any): void;
    _onImageError(evt: any): void;
    getImages(): any;
    isActive(): boolean;
    activate(): this;
    deactivate(): this;
    _notifyCompleteIfNeeded(): void;
    _completeImage(image: any): void;
    _addImageListeners(image: any): void;
}

declare const getLetterHTML: (letter: string) => string;
declare const applyAccentTypography: (element: Element | undefined | null, lineClassName?: string) => void;

declare const easeLinear: (x: any) => any;
declare const easeInQuad: (x: any) => number;
declare const easeInCubic: (x: any) => number;
declare const easeInExpo: (x: any) => any;
declare const easeInElastic: (x: any) => any;
declare const easeOutQuad: (x: any) => number;
declare const easeOutCubic: (x: any) => number;
declare const easeOutExpo: (x: any) => number;
declare const easeOutElastic: (x: any) => any;
declare const createPower: (power: any) => (x: any) => number;
declare const createBack: (elasticity: any) => (x: any) => number;
declare const bounce: (x: any) => number;
declare const createElastic: (segment: any) => (x: any) => number;
declare const calculateCirc: (x: any) => number;
declare const convertToEaseOut: (onEase?: (x: any) => any, speed?: number) => (t: any) => number;
declare const convertToEaseInOut: (onEase?: (x: any) => any) => (t: any) => number;
declare const convertToEaseOutIn: (onEase?: (x: any) => any) => (t: any) => number;
declare const ease: (x: number) => number;
declare const easeIn: (x: number) => number;
declare const easeOut: (x: number) => number;
declare const easeInOut: (x: number) => number;
declare const easeOutIn: (t: any) => number;
declare const easeInOutSine: (x: number) => number;
declare const easeSine: (value: any, onEase: any) => number;

declare function convertDegreesToRadians(degrees: any): number;
declare function convertRadiansToDegrees(radians: any): number;
declare function convertTangentToDegrees(tangent: any): number;
declare function calculateTangentY1(x0: any, y0: any, x1: any, dy0: any): any;
declare function rotatePoint([x, y]: [any, any], degrees?: number): number[];
declare function createCalculator({ xRange: [minX, maxX], yRange: [startY, endY], onProgress, }: CalculatorRange): Calculator;
declare function createCompositeCalculator(ranges: CalculatorRange[]): Calculator;
declare function createSinusCalculator({ x, y, width, height, amplitude }: number): {
    calculateY: ((arg0: progress) => number);
};
type CalculatorRange = {
    xRange: [minX: number, maxX: number];
    yRange: [startX: number, endX: number];
    onProgress: Easing;
};

export { CalculatorRange, FrameAnimation, ImagesCompleteListener, applyAccentTypography, bounce, calculateCirc, calculateIteration, calculateIterationProgress, calculateTangentY1, convertDegreesToRadians, convertRadiansToDegrees, convertTangentToDegrees, convertToEaseInOut, convertToEaseOut, convertToEaseOutIn, createBack, createCalculator, createCompositeCalculator, createElastic, createPower, createSinusCalculator, ease, easeIn, easeInCubic, easeInElastic, easeInExpo, easeInOut, easeInOutSine, easeInQuad, easeLinear, easeOut, easeOutCubic, easeOutElastic, easeOutExpo, easeOutIn, easeOutQuad, easeSine, getLetterHTML, rotatePoint };
