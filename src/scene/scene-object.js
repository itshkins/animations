import {ensureImage} from 'helpers/document-helpers'

export class SceneObject {
  /**
   * @param {Array<HTMLImageElement | string>} images
   * @param {SceneObjectState|any} state
   * @param {FrameAnimation} animation
   * @param {Array<FrameAnimation>} animations
   * @param {function(context: CanvasRenderingContext2D, state: SceneObjectState, images: Array<HTMLImageElement>): void} onRenderObject
   */
  constructor({
                images = [],
                state,
                animation,
                animations = [animation],
                onRenderObject,
              }) {
    animations.forEach((it) => {
      it.setState(state)
    })

    this.images = images.map(ensureImage)
    this.state = state
    this.animations = animations
    this.onRenderObject = onRenderObject
  }
}
