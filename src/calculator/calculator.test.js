import {describe, it} from 'mocha';
import {assert} from 'chai';

import {createCalculator, createCompositeCalculator} from './calculator';
import {easeInQuad} from './easings';

const {throws, doesNotThrow, strictEqual, approximately} = assert;

const DELTA = 0.01;

describe(`Calculator`, () => {
  it(`should throw Error when createCalculator is called with minX > maxX`, () => {
    throws(() => createCalculator({xRange: [1, 0], yRange: [0, 1]}));
  });

  it(`should not throw Error when createCalculator is called with startY > endY`, () => {
    doesNotThrow(() => createCalculator({xRange: [0, 1], yRange: [1, 0]}));
  });

  it(`should calculate values correctly when yRange is 0 to 1`, () => {
    const calculate = createCalculator({xRange: [0, 1], yRange: [0, 1]});
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(0.25, calculate(0.25), DELTA);
    approximately(0.5, calculate(0.5), DELTA);
    approximately(0.75, calculate(0.75), DELTA);
    strictEqual(1, calculate(1));
    strictEqual(1, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 0 to 100`, () => {
    const calculate = createCalculator({xRange: [0, 1], yRange: [0, 100]});
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(25, calculate(0.25), DELTA);
    approximately(50, calculate(0.5), DELTA);
    approximately(75, calculate(0.75), DELTA);
    strictEqual(100, calculate(1));
    strictEqual(100, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is -100 to 100`, () => {
    const calculate = createCalculator({xRange: [0, 1], yRange: [-100, 100]});
    strictEqual(-100, calculate(-0.1));
    strictEqual(-100, calculate(0));
    approximately(-50, calculate(0.25), DELTA);
    approximately(0, calculate(0.5), DELTA);
    approximately(50, calculate(0.75), DELTA);
    strictEqual(100, calculate(1));
    strictEqual(100, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 1 down to 0`, () => {
    const calculate = createCalculator({xRange: [0, 1], yRange: [1, 0]});
    strictEqual(1, calculate(-0.1));
    strictEqual(1, calculate(0));
    approximately(0.75, calculate(0.25), DELTA);
    approximately(0.5, calculate(0.5), DELTA);
    approximately(0.25, calculate(0.75), DELTA);
    strictEqual(0, calculate(1));
    strictEqual(0, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 100 down to 0`, () => {
    const calculate = createCalculator({xRange: [0, 1], yRange: [100, 0]});
    strictEqual(100, calculate(-0.1));
    strictEqual(100, calculate(0));
    approximately(75, calculate(0.25), DELTA);
    approximately(50, calculate(0.5), DELTA);
    approximately(25, calculate(0.75), DELTA);
    strictEqual(0, calculate(1));
    strictEqual(0, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 100 down to -100`, () => {
    const calculate = createCalculator({xRange: [0, 1], yRange: [100, -100]});
    strictEqual(100, calculate(-0.1));
    strictEqual(100, calculate(0));
    approximately(50, calculate(0.25), DELTA);
    approximately(0, calculate(0.5), DELTA);
    approximately(-50, calculate(0.75), DELTA);
    strictEqual(-100, calculate(1));
    strictEqual(-100, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 0 down to -1`, () => {
    const calculate = createCalculator({xRange: [0, 1], yRange: [0, -1]});
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(-0.25, calculate(0.25), DELTA);
    approximately(-0.5, calculate(0.5), DELTA);
    approximately(-0.75, calculate(0.75), DELTA);
    strictEqual(-1, calculate(1));
    strictEqual(-1, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 0 down to -100`, () => {
    const calculate = createCalculator({xRange: [0, 1], yRange: [0, -100]});
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(-25, calculate(0.25), DELTA);
    approximately(-50, calculate(0.5), DELTA);
    approximately(-75, calculate(0.75), DELTA);
    strictEqual(-100, calculate(1));
    strictEqual(-100, calculate(1.1));
  });

  it(`should calculate values correctly when xRange is 0 to 100`, () => {
    const calculate = createCalculator({xRange: [0, 100], yRange: [0, 1]});
    strictEqual(0, calculate(-10));
    strictEqual(0, calculate(0));
    approximately(0.25, calculate(25), DELTA);
    approximately(0.5, calculate(50), DELTA);
    approximately(0.75, calculate(75), DELTA);
    strictEqual(1, calculate(100));
    strictEqual(1, calculate(110));
  });

  it(`should calculate values correctly when xRange is -100 to 100`, () => {
    const calculate = createCalculator({xRange: [-100, 100], yRange: [0, 1]});
    strictEqual(0, calculate(-110));
    strictEqual(0, calculate(-100));
    approximately(0.25, calculate(-50), DELTA);
    approximately(0.5, calculate(0), DELTA);
    approximately(0.75, calculate(50), DELTA);
    strictEqual(1, calculate(100));
    strictEqual(1, calculate(110));
  });

  it(`should calculate values correctly when quadratic easing is specified`, () => {
    const calculate = createCalculator({xRange: [0, 100], yRange: [0, 100], onProgress: easeInQuad});
    strictEqual(0, calculate(-10));
    strictEqual(0, calculate(0));
    approximately(6.25, calculate(25), DELTA);
    approximately(25, calculate(50), DELTA);
    approximately(56.25, calculate(75), DELTA);
    strictEqual(100, calculate(100));
    strictEqual(100, calculate(110));
  });

  it(`should calculate values correctly when there is only single point on x axes`, () => {
    const calculate = createCalculator({xRange: [0, 0], yRange: [0, 100], onProgress: easeInQuad});
    strictEqual(100, calculate(-10));
    strictEqual(100, calculate(0));
    strictEqual(100, calculate(110));
  });
});

describe(`Composite Calculator`, () => {
  it(`should throw Error when createCompositeCalculator is called with minX > maxX`, () => {
    throws(() => createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [1, 0], yRange: [0, 1]},
    ]));

    throws(() => createCompositeCalculator([
      {xRange: [1, 0], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [0, 1]},
    ]));
  });

  it(`should not throw Error when createCompositeCalculator is called with startY > endY`, () => {
    doesNotThrow(() => createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [0, 1]},
    ]));
  });

  it(`should calculate values correctly when yRange is 0 to 1`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 100]},
      {xRange: [0, 1], yRange: [0, 1]},
    ]);
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(0.25, calculate(0.25), DELTA);
    approximately(0.5, calculate(0.5), DELTA);
    approximately(0.75, calculate(0.75), DELTA);
    strictEqual(1, calculate(1));
    strictEqual(1, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 0 to 100`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [0, 100]},
    ]);
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(25, calculate(0.25), DELTA);
    approximately(50, calculate(0.5), DELTA);
    approximately(75, calculate(0.75), DELTA);
    strictEqual(100, calculate(1));
    strictEqual(100, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is -100 to 100`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [-100, 100]},
    ]);
    strictEqual(-100, calculate(-0.1));
    strictEqual(-100, calculate(0));
    approximately(-50, calculate(0.25), DELTA);
    approximately(0, calculate(0.5), DELTA);
    approximately(50, calculate(0.75), DELTA);
    strictEqual(100, calculate(1));
    strictEqual(100, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 1 down to 0`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [1, 0]},
    ]);
    strictEqual(1, calculate(-0.1));
    strictEqual(1, calculate(0));
    approximately(0.75, calculate(0.25), DELTA);
    approximately(0.5, calculate(0.5), DELTA);
    approximately(0.25, calculate(0.75), DELTA);
    strictEqual(0, calculate(1));
    strictEqual(0, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 100 down to 0`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [100, 0]},
    ]);
    strictEqual(100, calculate(-0.1));
    strictEqual(100, calculate(0));
    approximately(75, calculate(0.25), DELTA);
    approximately(50, calculate(0.5), DELTA);
    approximately(25, calculate(0.75), DELTA);
    strictEqual(0, calculate(1));
    strictEqual(0, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 100 down to -100`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [100, -100]},
    ]);
    strictEqual(100, calculate(-0.1));
    strictEqual(100, calculate(0));
    approximately(50, calculate(0.25), DELTA);
    approximately(0, calculate(0.5), DELTA);
    approximately(-50, calculate(0.75), DELTA);
    strictEqual(-100, calculate(1));
    strictEqual(-100, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 0 down to -1`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [0, -1]},
    ]);
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(-0.25, calculate(0.25), DELTA);
    approximately(-0.5, calculate(0.5), DELTA);
    approximately(-0.75, calculate(0.75), DELTA);
    strictEqual(-1, calculate(1));
    strictEqual(-1, calculate(1.1));
  });

  it(`should calculate values correctly when yRange is 0 down to -100`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 1], yRange: [0, -100]},
    ]);
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(-25, calculate(0.25), DELTA);
    approximately(-50, calculate(0.5), DELTA);
    approximately(-75, calculate(0.75), DELTA);
    strictEqual(-100, calculate(1));
    strictEqual(-100, calculate(1.1));
  });

  it(`should calculate values correctly when xRange is 0 to 100`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 100], yRange: [0, 1]},
    ]);
    strictEqual(0, calculate(-10));
    strictEqual(0, calculate(0));
    approximately(0.25, calculate(25), DELTA);
    approximately(0.5, calculate(50), DELTA);
    approximately(0.75, calculate(75), DELTA);
    strictEqual(1, calculate(100));
    strictEqual(1, calculate(110));
  });

  it(`should calculate values correctly when xRange is -100 to 100`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [-100, 100], yRange: [0, 1]},
    ]);
    strictEqual(0, calculate(-110));
    strictEqual(0, calculate(-100));
    approximately(0.25, calculate(-50), DELTA);
    approximately(0.5, calculate(0), DELTA);
    approximately(0.75, calculate(50), DELTA);
    strictEqual(1, calculate(100));
    strictEqual(1, calculate(110));
  });

  it(`should calculate values correctly when quadratic easing is specified`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [0, 100], yRange: [0, 100], onProgress: easeInQuad},
    ]);
    strictEqual(0, calculate(-10));
    strictEqual(0, calculate(0));
    approximately(6.25, calculate(25), DELTA);
    approximately(25, calculate(50), DELTA);
    approximately(56.25, calculate(75), DELTA);
    strictEqual(100, calculate(100));
    strictEqual(100, calculate(110));
  });

  it(`should calculate values correctly when there is only single point on x axes`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 1], yRange: [0, 1]},
      {xRange: [1, 1], yRange: [-100, 100]},
    ]);
    strictEqual(0, calculate(-0.1));
    strictEqual(0, calculate(0));
    approximately(0.25, calculate(0.25), DELTA);
    approximately(0.5, calculate(0.5), DELTA);
    approximately(0.75, calculate(0.75), DELTA);
    strictEqual(100, calculate(1));
    strictEqual(100, calculate(1.1));
  });

  it(`should calculate values correctly with disjoint ranges`, () => {
    const calculate = createCompositeCalculator([
      {xRange: [0, 0.4], yRange: [-100, -50]},
      {xRange: [0.6, 1], yRange: [50, 100]},
    ]);
    strictEqual(-100, calculate(-0.1));
    strictEqual(-100, calculate(0));
    approximately(-75, calculate(0.2), DELTA);
    approximately(-50, calculate(0.4), DELTA);
    approximately(-50, calculate(0.5), DELTA);
    approximately(50, calculate(0.6), DELTA);
    approximately(75, calculate(0.8), DELTA);
    strictEqual(100, calculate(1));
    strictEqual(100, calculate(1.1));
  });
});
