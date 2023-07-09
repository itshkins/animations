const ensureImage = (imageOrSource) => {
  if (imageOrSource instanceof HTMLImageElement) {
    return imageOrSource
  }
  const image = new Image()
  image.src = imageOrSource
  return image
}

export class ImagesCompleteListener {
  /**
   * @param {Array<HTMLImageElement>} images
   * @param {function(ImagesCompleteListener): void} onComplete
   */
  constructor({images, onComplete}) {
    this._images = images.map(ensureImage)
    this._onComplete = onComplete

    this._incompleteImages = new Set()
    this._isActive = false

    this._removeImageListeners = this._removeImageListeners.bind(this)
    this._onImageLoad = this._onImageLoad.bind(this)
    this._onImageError = this._onImageError.bind(this)
  }

  getImages() {
    return this._images
  }

  isActive() {
    return this._isActive
  }

  activate() {
    this._isActive = true
    this._images.forEach((image) => {
      if (!image.complete) {
        this._addImageListeners(image)
        this._incompleteImages.add(image)
      }
    })
    this._notifyCompleteIfNeeded()
    return this
  }

  deactivate() {
    this._incompleteImages.forEach(this._removeImageListeners)
    this._incompleteImages.clear()
    this._isActive = false
    return this
  }

  _notifyCompleteIfNeeded() {
    if (this._incompleteImages.size === 0 && this._isActive) {
      Promise.resolve().then(() => {
        if (this._isActive) {
          this._isActive = false
          this._onComplete(this)
        }
      })
    }
  }

  _completeImage(image) {
    this._removeImageListeners(image)
    this._incompleteImages.delete(image)
    this._notifyCompleteIfNeeded()
  }

  _addImageListeners(image) {
    image.addEventListener(`load`, this._onImageLoad, {once: true})
    image.addEventListener(`error`, this._onImageError, {once: true})
  }

  _removeImageListeners(image) {
    image.removeEventListener(`load`, this._onImageLoad)
    image.removeEventListener(`error`, this._onImageError)
  }

  _onImageLoad(evt) {
    this._completeImage(evt.currentTarget)
  }

  _onImageError(evt) {
    this._completeImage(evt.currentTarget)
  }
}
