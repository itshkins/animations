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
