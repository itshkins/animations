# Frame Animation Engine with Some Predefined Easing Functions

## Tween Animation Example
```js
const formatNumber = (value) => String(value).padStart(2, `0`)
const counterElement = document.querySelector(`.counter`)
new FrameAnimation({
  duration: 5000,
  fps: 1,
  onRenderFrame({frameId: elapsedSeconds, duration}) {
    const remainingSeconds = duration - elapsedSeconds
    const minutes = Math.floor(remainingSeconds / 1000)
    const seconds = remainingSeconds % 1000
    counterElement.textContent = [minutes, seconds].map(formatNumber).join(`:`)
  },
}).start()
```

## Accent Typography Example
```js
const textElement = document.querySelector(`.text`)
applyAccentTypography(textElement)
```

```scss
.text {
  @include accent-animation(0.4s, 1.6s, 1, 0.033s,
    // 01 - 31.05 / 2020
    (4, 3, 0, 2, 0, 5, 2, 2, 3, 6, 0, 3, 0, 1, 5, 4, 2));
}
```
