# Accent typography usage

```js
// let's say text element contains "08 - 09.07 / 2023"
const textElement = document.querySelector(`.text`)
animations.applyAccentTypography(textElement)
```

```scss
.text {
  @include accent-animation(0.4s, 1.6s, 1, 0.033s,
    // 0  8     -     0  9  .  0  7     /     2  0  2  3
      (4, 3, 0, 2, 0, 5, 2, 2, 3, 6, 0, 3, 0, 1, 5, 4, 2));
}
```
