import {calculateTangentY1, convertDegreesToRadians} from '../calculator/calculator'

export const renderPolyline = (context, points) => {
  context.beginPath()
  points.forEach((point, i) => {
    if (i === 0) {
      context.moveTo(...point)
    } else {
      context.lineTo(...point)
    }
  })
  context.stroke()
}

export const renderChart = (context, [x1, x2, dx], fx) => {
  context.beginPath()
  for (let x = x1; x <= x2; x += dx) {
    const y = fx(x)
    if (x === x1) {
      context.moveTo([x, y])
    } else {
      context.lineTo([x, y])
    }
  }
  context.stroke()
}

export const renderTangent = (context, [x1, x2, dx], fx, dfx) => {
  for (let x = x1; x <= x2; x += dx) {
    const y = fx(x)
    const x_ = x + dx / 2
    const y_ = calculateTangentY1(x, y, x_, dfx(x))

    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x_, y_)
    context.stroke()
  }
}

export const renderBezier = (context, bezier, zoom = 20) => {
  context.beginPath()
  for (let i = 0; i <= zoom; i++) {
    const t = i / zoom
    const x = bezier.calculateX(t)
    const y = bezier.calculateY(t)
    if (i === 0) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  }
  context.stroke()
}

export const renderNativeBezier = (context, points) => {
  context.beginPath()
  context.moveTo(...points[0])
  context.bezierCurveTo(...points.slice(1))
  context.stroke()
}

export class SceneObjectState {
  constructor({
                opacity = 1,
                centerX = 0.5,
                centerY = 0.5,
                scaleX = 1,
                scaleY = 1,
                rotate = 0,
                x = 0,
                y = 0,
                translateX = 0,
                translateY = 0,
                ...state
              }) {
    this.opacity = opacity
    this.centerX = centerX
    this.centerY = centerY
    this.x = x
    this.y = y
    this.translateX = translateX
    this.translateY = translateY
    this.scaleX = scaleX
    this.scaleY = scaleY
    this.rotate = rotate

    Object.assign(this, state)
  }

  shouldRender() {
    return this.opacity > 0
      && this.scaleX !== 0
      && this.scaleY !== 0
      && this.width !== 0
      && this.height !== 0
  }

  shouldMemoContext() {
    return this.opacity !== 1
      || this.centerX !== 0
      || this.centerY !== 0
      || this.x !== 0
      || this.y !== 0
      || this.translateX !== 0
      || this.translateY !== 0
      || this.scaleX !== 1
      || this.scaleY !== 1
      || this.rotate !== 0
  }

  /**
   * @param {HTMLImageElement} image
   * @param {boolean} force
   */
  synchronizeHeightIfNeeded(image, force = false) {
    if (!this.height || force) {
      this.height = image.height / image.width * this.width
    }
  }

  /** @param {CanvasRenderingContext2D} context */
  save(context) {
    if (this.shouldMemoContext()) {
      context.save()
    }
  }

  /** @param {CanvasRenderingContext2D} context */
  restore(context) {
    if (this.shouldMemoContext()) {
      context.restore()
    }
  }

  doOpacity(context, force = false) {
    if (this.opacity !== 1 || force) {
      context.globalAlpha = this.opacity
    }
  }

  /** @param {CanvasRenderingContext2D} context */
  doTranslate(context) {
    if (this.x !== 0 || this.translateX !== 0 || this.y !== 0 || this.translateY !== 0) {
      context.translate(this.x + this.translateX, this.y + this.translateY)
    }
  }

  /** @param {CanvasRenderingContext2D} context */
  doRotate(context) {
    if (this.rotate !== 0) {
      context.rotate(convertDegreesToRadians(this.rotate))
    }
  }

  /** @param {CanvasRenderingContext2D} context */
  doScale(context) {
    if (this.scaleX !== 1 || this.scaleY !== 1) {
      context.scale(this.scaleX, this.scaleY)
    }
  }

  /** @param {CanvasRenderingContext2D} context */
  transform(context) {
    this.doOpacity(context)
    this.doTranslate(context)
    this.doRotate(context)
    this.doScale(context)
  }

  renderImage(context, image) {
    this.save(context)
    this.transform(context)
    this.doRenderImage(context, image)
    this.restore(context)
  }

  doRenderImage(context, image) {
    const x = -this.centerX * this.width * Math.sign(this.scaleX)
    const y = -this.centerY * this.height * Math.sign(this.scaleY)
    const width = this.width * Math.sign(this.scaleX)
    const height = this.height * Math.sign(this.scaleY)

    context.drawImage(image, x, y, width, height)
  }
}
