import {createBezierEasing} from './bezier-easing'

/** @typedef {function(x: number): number} Easing */

const {PI, sin, cos, acos} = Math

export const easeLinear = (x) => x

export const easeInQuad = (x) => x * x
export const easeInCubic = (x) => x * x * x
export const easeInExpo = (x) => x === 0 ? x : 2 ** (10 * x - 10)
export const easeInElastic = (x) => x === 0 || x === 1 ? x : 2 ** (10 * x - 10) * sin(x * 10 - 10.75) * 2 * PI / 3

export const easeOutQuad = (x) => 1 - (1 - x) ** 2
export const easeOutCubic = (x) => 1 - (1 - x) ** 3
export const easeOutExpo = (x) => 1 - 2 ** (-10 * x)
export const easeOutElastic = (x) => x === 0 || x === 1 ? x : 2 ** (-10 * x) * sin(x * 10 - 0.75) * 2 * PI / 3 + 1

export const createPower = (power) => (x) => x ** power
export const createBack = (elasticity) => (x) => x ** 2 * ((elasticity + 1) * x - elasticity)

export const bounce = (x) => {
  x = x < 0 ? 0 : x
  for (let a = 0, b = 1; ; a += b, b /= 2) {
    if (x >= (7 - 4 * a) / 11) {
      return -(((11 - 6 * a - 11 * x) / 4) ** 2) + b ** 2
    }
  }
}

export const createElastic = (segment) => (x) => 2 ** (10 * (x - 1)) * cos(20 * PI * segment / 3 * x)
export const calculateCirc = (x) => 1 - sin(acos(x))

export const convertToEaseOut = (onEase = easeLinear, speed = 1) => {
  return (t) => {
    return speed - onEase(speed * (1 - t))
  }
}

export const convertToEaseInOut = (onEase = easeLinear) => {
  const onEaseOut = convertToEaseOut(onEase, 2)
  return (t) => {
    return t < 0.5
      ? onEase(2 * t) / 2
      : onEaseOut(t) / 2
  }
}

export const convertToEaseOutIn = (onEase = easeLinear) => {
  const onEaseOut = convertToEaseOut(onEase)
  return (t) => {
    return t < 0.5
      ? onEaseOut(2 * t) / 2
      : (onEase(2 * t - 1) + 1) / 2
  }
}

export const ease = createBezierEasing(0.25, 0.1, 0.25, 1)
export const easeIn = createBezierEasing(0.42, 0, 1, 1)
export const easeOut = createBezierEasing(0, 0, 0.58, 1)
export const easeInOut = createBezierEasing(0.42, 0, 0.58, 1)
export const easeOutIn = convertToEaseOutIn(easeIn)

export const easeInOutSine = createBezierEasing(0.37, 0, 0.63, 1)

export const easeSine = (value, onEase) => onEase((value + 1) / 2) * 2 - 1
