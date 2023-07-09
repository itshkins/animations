# Images complete listener usage

* Let's say we have images that we want to animate.
* So we want to preload all of them before animation starts.

```js
new ImagesCompleteListener({
  images: [
    document.querySelector(`.animation-image`),
    `https://via.placeholder.com/400/300`,
  ],
  onComplete: () => {
    console.log(`All the images are preloaded`)
  },
}).activate()
```
