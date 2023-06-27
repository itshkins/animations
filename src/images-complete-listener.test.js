import {describe, it, beforeEach} from 'mocha'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {JSDOM} from 'jsdom'

import {ImagesCompleteListener} from './images-complete-listener'

chai.use(sinonChai)
const {isTrue, isFalse} = chai.assert
const {calledOnceWithExactly, notCalled} = sinon.assert

describe(`Images Complete Listener`, () => {
  const Src = {
    INVALID: `invalid-src`,
    VALID: `valid-src`,
  }

  beforeEach(() => {
    const {window} = new JSDOM(`<!doctype html><html><head></head><body></body></html>`)

    /* eslint-disable-next-line no-undef */
    const globals = global

    globals.HTMLImageElement = window.HTMLImageElement
    globals.Image = window.Image

    Object.defineProperty(globals.Image.prototype, `complete`, {
      get() {
        return this._complete
      },
      set(value) {
        this._complete = value
      },
    })

    Object.defineProperty(globals.Image.prototype, `src`, {
      set(src) {
        this.complete = false
        if (src === Src.INVALID) {
          setTimeout(() => {
            this.complete = true
            this.dispatchEvent(new window.CustomEvent(`error`))
          })
          return
        }
        if (src === Src.VALID) {
          setTimeout(() => {
            this.complete = true
            this.dispatchEvent(new window.CustomEvent(`load`))
          })
          return
        }
      },
    })
  })

  const sleep = (interval = undefined) => new Promise((resolve) => {
    setTimeout(resolve, interval)
  })

  const addListener = (images, onComplete) => {
    const listener = new ImagesCompleteListener({images, onComplete})
    isFalse(listener.isActive())
    listener.activate()
    isTrue(listener.isActive())
    return listener
  }

  const complete = async (listener, cb, interval = undefined) => {
    isTrue(listener.isActive())
    await sleep(interval)

    calledOnceWithExactly(cb, listener)
    isTrue(listener.getImages().every((image) => image.complete))
    isFalse(listener.isActive())
  }

  const doesNotComplete = async (listener, cb, interval = 1000) => {
    isFalse(listener.isActive())
    await sleep(interval)

    notCalled(cb)
    isFalse(listener.isActive())
  }

  it(`should complete on empty list`, async () => {
    const cb = sinon.spy()
    const listener = addListener([], cb)
    await complete(listener, cb)
  })

  it(`should complete on valid images`, async () => {
    const cb = sinon.spy()
    const listener = addListener([Src.VALID], cb)
    await complete(listener, cb)
  })

  it(`should complete on invalid images`, async () => {
    const cb = sinon.spy()
    const listener = addListener([Src.INVALID], cb)
    await complete(listener, cb)
  })

  it(`should complete on mixed images`, async () => {
    const cb = sinon.spy()
    const listener = addListener([Src.VALID, Src.INVALID], cb)
    await complete(listener, cb)
  })

  it(`should not complete on deactivate`, async () => {
    const cb = sinon.spy()
    const listener = addListener([], cb)
    listener.deactivate()
    await doesNotComplete(listener, cb)
  })
})
