const {pow} = Math

const sampleCurve = (t, a, b, c, d) => {
  const t_ = 1 - t
  return pow(t_, 3) * a
    + 3 * t * pow(t_, 2) * b
    + 3 * pow(t, 2) * t_ * c
    + pow(t, 3) * d
}

const sampleDerivative = (t, a, b, c, d) => {
  const t_ = 1 - t
  return 3 * pow(t_, 2) * (b - a)
    + 6 * t_ * t * (c - b)
    + 3 * pow(t, 2) * (d - c)
}

export class CubicBezier {
  constructor([x1, y1], [x2, y2], [x3, y3], [x4, y4]) {
    this._points = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]

    this._x1 = x1
    this._x2 = x2
    this._x3 = x3
    this._x4 = x4

    this._y1 = y1
    this._y2 = y2
    this._y3 = y3
    this._y4 = y4

    this.calculateX = this.calculateX.bind(this)
    this.calculateY = this.calculateY.bind(this)
    this.calculateTangent = this.calculateTangent.bind(this)
  }

  getPoints() {
    return this._points
  }

  calculateX(progress) {
    return sampleCurve(progress, this._x1, this._x2, this._x3, this._x4)
  }

  calculateY(progress) {
    return sampleCurve(progress, this._y1, this._y2, this._y3, this._y4)
  }

  calculateTangent(progress) {
    return sampleDerivative(progress, this._y1, this._y2, this._y3, this._y4)
      /
      sampleDerivative(progress, this._x1, this._x2, this._x3, this._x4)
  }
}
