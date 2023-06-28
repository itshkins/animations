import {FrameAnimation} from 'helpers/frame-animation'
import {ImagesCompleteListener} from 'helpers/images-complete-listener'

const RETINA_RATIO = 2

export class Scene {
  /**
   * @param {string} name
   * @param {HTMLElement} container
   * @param {HTMLCanvasElement} canvas
   * @param {number} zoom
   * @param {boolean} shouldRenderAxes
   * @param {object} animationProps
   * @param {Array<SceneObject>} objects
   */
  constructor({
                name = performance.now(),
                container,
                canvas,
                zoom = 1,
                shouldRenderAxes = false,
                animationProps,
                objects,
              }) {
    this._name = name
    this._zoom = zoom
    this._shouldRenderAxes = shouldRenderAxes
    this._container = container
    this._canvas = canvas
    this._context = canvas.getContext(`2d`)
    this._width = 0
    this._height = 0

    this._sceneAnimation = new FrameAnimation({
      name: this._name,
      ...animationProps,
      onRenderFrame: () => this._renderFrame(),
    })

    this._objects = objects

    this._imagesCompleteListener = new ImagesCompleteListener({
      images: objects.reduce((images, object) => images.concat(object.images || []), []),
      onComplete: () => this._doActivate(),
    })

    this._onWindowResize = this._onWindowResize.bind(this)
  }

  getImages() {
    return this._imagesCompleteListener.getImages()
  }

  activate() {
    this._imagesCompleteListener.activate()
  }

  _doActivate() {
    this._resize()
    window.addEventListener(`resize`, this._onWindowResize)

    for (const object of this._objects) {
      for (const animation of object.animations) {
        animation.start()
      }
    }
    this._sceneAnimation.start()
  }

  deactivate() {
    this._imagesCompleteListener.deactivate()

    this._sceneAnimation.stop()
    for (const object of this._objects) {
      for (const animation of object.animations) {
        animation.stop()
      }
    }

    window.removeEventListener(`resize`, this._onWindowResize)
    this._width = 0
    this._height = 0
  }

  _renderFrame() {
    this._context.setTransform(1, 0, 0, 1, 0, 0)
    this._context.clearRect(0, 0, this._width, this._height)

    if (this._shouldRenderAxes) {
      this._context.fillStyle = `rgba(255, 255, 255, 0.1)`
      this._context.fillRect(0, 0, this._width, this._height)
    }

    const minSize = Math.min(this._width, this._height)
    const zoom = minSize / 2 / this._zoom
    const centerX = this._width / 2
    const centerY = this._height / 2
    const zoomedSize = {
      width: centerX / zoom,
      height: centerY / zoom,
    }
    this._context.setTransform(zoom, 0, 0, zoom, centerX, centerY)

    this._renderAxesIfNeeded()

    for (const object of this._objects) {
      if (object.state.shouldRender()) {
        object.onRenderObject(this._context, object.state, object.images, zoomedSize)
      }
    }
  }

  _renderAxesIfNeeded() {
    if (!this._shouldRenderAxes) {
      return
    }
    this._context.fillStyle = `rgba(255, 255, 255, 0.05)`
    this._context.fillRect(-this._zoom, -this._zoom, 2 * this._zoom, 2 * this._zoom)

    this._context.strokeWidth = 1
    this._context.strokeStyle = `rgba(0, 0, 0, 0.2)`

    this._context.beginPath()
    this._context.moveTo(0, -this._height / 2)
    this._context.lineTo(0, this._height / 2)
    this._context.stroke()

    this._context.beginPath()
    this._context.moveTo(-this._width / 2, 0)
    this._context.lineTo(this._width / 2, 0)
    this._context.stroke()
  }

  _resize() {
    this._canvas.width = this._width = this._container.clientWidth * RETINA_RATIO
    this._canvas.height = this._height = this._container.clientHeight * RETINA_RATIO
  }

  _onWindowResize() {
    this._resize()
    this._sceneAnimation.rerenderIfActive()
  }
}
