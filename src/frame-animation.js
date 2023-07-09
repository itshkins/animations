import {easeLinear} from './utils/easings'

const SECOND = 1000
const PLAYBACK_RATE = 1
const MAX_PROGRESS = 1
const MAX_PROGRESS_WITH_ALTERNATION = 2 * MAX_PROGRESS
const TIME_ORIGIN = Date.now() - Math.trunc(performance.now())

const calculateElapsed = (currentTimestamp, startTimestamp, delay) => {
  return Math.max(0, (currentTimestamp - (startTimestamp + delay)) * PLAYBACK_RATE)
}

const calculateProgress = (elapsed, duration, shouldAlternate) => {
  const rawProgress = Math.max(0, elapsed / duration)
  if (!shouldAlternate) {
    return Math.min(rawProgress, MAX_PROGRESS)
  }
  const constraintProgress = rawProgress === MAX_PROGRESS_WITH_ALTERNATION
    ? MAX_PROGRESS_WITH_ALTERNATION
    : rawProgress % MAX_PROGRESS_WITH_ALTERNATION

  return constraintProgress > MAX_PROGRESS
    ? MAX_PROGRESS_WITH_ALTERNATION - constraintProgress
    : Math.min(constraintProgress, MAX_PROGRESS)
}

export const calculateIteration = (elapsed, duration) => {
  return Math.max(0, Math.floor(elapsed / duration))
}

export const calculateIterationProgress = (elapsed, duration) => {
  return elapsed % duration / duration
}

const calculateFrameId = (fps, progress, duration) => {
  return Math.trunc(progress * duration / SECOND * fps)
}

const calculateAnimationDuration = (fps, framesCount) => {
  return Math.ceil(SECOND / fps * (framesCount - 1))
}

export class FrameAnimation {
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
                onRenderFrame,
              }) {
    this._name = name

    this._shouldPreloadFirstFrame = shouldPreloadFirstFrame
    this._shouldAlternate = shouldAlternate
    this._shouldSkipDuplicates = shouldSkipDuplicates

    this._delay = delay / PLAYBACK_RATE
    this._fps = fps
    this._frames = frames
    this._onProgress = onProgress
    this._onRenderFrame = onRenderFrame

    if (duration === Infinity) {
      this._duration = Number.MAX_SAFE_INTEGER
    } else if (!duration) {
      this._duration = calculateAnimationDuration(fps, frames.length)
    } else {
      this._duration = duration
    }

    this._delayTimer = 0
    this._startTimestamp = 0
    this._isFirstFrameRendered = false
    this._latestAnimationFrameId = 0
    this._latestRenderState = null

    this._userState = userState
    this._onScheduleFrame = this._onScheduleFrame.bind(this)
    this._onDelayFrame = this._onDelayFrame.bind(this)
    this._onRerenderFrame = this._onRerenderFrame.bind(this)
    this._onFrame = this._onFrame.bind(this)
  }

  setState(state) {
    this._userState = this._userState || {}
    this._userState.state = state
  }

  getStartTimestamp() {
    return this._startTimestamp
  }

  hasStarted() {
    return this.getStartTimestamp() > 0
  }

  restart(startTimestamp = Date.now()) {
    this.stop()
    this.start(startTimestamp)
  }

  start(startTimestamp = Date.now()) {
    if (this.hasStarted()) {
      return
    }
    this._startTimestamp = startTimestamp
    this._isFirstFrameRendered = false
    if (this._shouldPreloadFirstFrame) {
      this._onFrame(performance.now(), false, false)
    }
    this._delayTimer = setTimeout(this._onDelayFrame, this._delay)
  }

  stop() {
    this._startTimestamp = 0
    this._isFirstFrameRendered = false

    if (this._delayTimer > 0) {
      clearTimeout(this._delayTimer)
      this._delayTimer = 0
    }

    if (this._latestAnimationFrameId > 0) {
      cancelAnimationFrame(this._latestAnimationFrameId)
      this._latestAnimationFrameId = 0
      this._latestRenderState = null
      this._startTimestamp = 0
    }
  }

  rerenderIfActive() {
    if (!this.hasStarted() || this._latestAnimationFrameId > 0 || this._delayTimer > 0) {
      return
    }
    this._latestAnimationFrameId = requestAnimationFrame(this._onRerenderFrame)
  }

  _onFrame(performanceNow, shouldRequestNextFrameIfNeeded, shouldSkipDuplicates) {
    const currentTimestamp = this._isFirstFrameRendered
      ? TIME_ORIGIN + Math.trunc(performanceNow)
      : this._startTimestamp

    const elapsed = calculateElapsed(currentTimestamp, this._startTimestamp, this._delay)
    const iteration = calculateIteration(elapsed, this._duration)
    const progress = this._onProgress(calculateProgress(elapsed, this._duration, this._shouldAlternate))
    const renderFrameId = calculateFrameId(this._fps, progress, this._duration)

    if (this._shouldSkipDuplicates && shouldSkipDuplicates) {
      if (this._latestRenderState && this._latestRenderState.frameId === renderFrameId) {
        if (shouldRequestNextFrameIfNeeded) {
          this._latestAnimationFrameId = requestAnimationFrame(this._onScheduleFrame)
        }
        return
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
      frame: this._frames ? this._frames[renderFrameId] : undefined,
    }

    const canContinue = this._onRenderFrame(this._latestRenderState, this._userState) !== false
    this._isFirstFrameRendered = true

    if (canContinue) {
      if (progress < MAX_PROGRESS || this._shouldAlternate) {
        if (shouldRequestNextFrameIfNeeded) {
          this._latestAnimationFrameId = requestAnimationFrame(this._onScheduleFrame)
        }
        return
      }
    }
    this._latestAnimationFrameId = 0
  }

  _onDelayFrame() {
    this._delayTimer = 0
    this._onFrame(performance.now(), true, true)
  }

  _onScheduleFrame(performanceNow) {
    this._onFrame(performanceNow, true, true)
  }

  _onRerenderFrame(performanceNow) {
    this._onFrame(performanceNow, false, false)
  }
}
