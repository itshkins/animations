import {ImagesCompleteListener} from 'helpers/images-complete-listener'

export class CompositeScene {
  constructor(scenes) {
    this._scenes = scenes

    this._imagesCompleteListener = new ImagesCompleteListener({
      images: scenes.reduce((images, scene) => images.concat(scene.getImages()), []),
      onComplete: () => this._doActivate(),
    })
  }

  activate() {
    this._imagesCompleteListener.activate()
  }

  _doActivate() {
    for (const scene of this._scenes) {
      scene.activate()
    }
  }

  deactivate() {
    this._imagesCompleteListener.deactivate()

    for (const scene of this._scenes) {
      scene.deactivate()
    }
  }
}
