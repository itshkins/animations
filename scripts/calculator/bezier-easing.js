/**
 * Cubic Bézier curve.
 *
 * Based on `Source/WebCore/platform/graphics/UnitBezier.h` in WebKit.
 */

const EPSILON = 1e-6
const NEWTON_ITERATIONS = 8

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
    this.cx = 3.0 * x1
    this.bx = 3.0 * (x2 - x1) - this.cx
    this.ax = 1.0 - this.cx - this.bx

    this.cy = 3.0 * y1
    this.by = 3.0 * (y2 - y1) - this.cy
    this.ay = 1.0 - this.cy - this.by

    this.css = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`

    this.toString = this.toString.bind(this)
    this.solve = this.solve.bind(this)

    this.solve.toString = this.toString
  }

  /**
   * Solve the bezier curve for a given `x`.
   *
   * @param {number} x
   * @return {number}
   */
  solve(x) {
    return this._sampleY(this._solveX(x))
  }

  /**
   * Return css counterpart of a curve.
   *
   * @return {string}
   */
  toString() {
    return this.css
  }

  _sampleX(t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t
  }

  _sampleY(t) {
    return ((this.ay * t + this.by) * t + this.cy) * t
  }

  _sampleDerivativeX(t) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx
  }

  _solveX(x) {
    /** Fast path: Use Newton's method. */
    for (let t = x, _ = 0; _ < NEWTON_ITERATIONS; _++) {
      const x2 = this._sampleX(t) - x
      if (Math.abs(x2) < EPSILON) {
        return t
      }
      const dx = this._sampleDerivativeX(t)
      if (Math.abs(dx) < EPSILON) {
        break
      }
      t -= x2 / dx
    }

    /** Slow path: Use bisection. */
    let lo = 0.0
    let hi = 1.0
    let t = x

    if (t < lo) {
      return lo
    }
    if (t > hi) {
      return hi
    }

    while (lo < hi) {
      const x2 = this._sampleX(t)
      if (Math.abs(x2 - x) < EPSILON) {
        return t
      }
      if (x > x2) {
        lo = t
      } else {
        hi = t
      }
      t = (hi - lo) / 2.0 + lo
    }

    /** Failure. */
    return t
  }
}

export const createBezierEasing = (x1, y1, x2, y2) => new BezierEasing(x1, y1, x2, y2).solve
