"use strict";
/**@typedef {number|bigint|string} numstr*/
{
  /**
   * Returns the sine and cosine of a number, as a 2-tuple.
   * @param {number} x An angle measured in radians.
   */
  const sin_cos = x => [Math.sin(x), Math.cos(x)];

  /**
   * Checks if a value is in the interval [`min`, `max`)
   * @param {numstr} x
   * @param {numstr} min (inclusive/closed)
   * @param {numstr} max (exclusive/open)
   */
  const inRange = (x, min, max) => x >= min && x < max;

  const
    RAF = requestAnimationFrame,
    pretag = document.getElementById("d");

  let
    start = 0,
    A = 1,
    B = 1;

  const base_frame = () => {
    A += 0.07;
    B += 0.03;

    const
      m = 80,
      b = [],
      z = [];

    for (let k = 0; k < 1760; k++) {
      b[k] = k % m === m - 1 ? "\n" : " ";
      z[k] = 0;
    }

    const
      [sA, cA] = sin_cos(A),
      [sB, cB] = sin_cos(B),
      tmp0 = 6.28;

    for (let j = 0; j < tmp0; j += 0.07) {
      // j <=> theta
      const [st, ct] = sin_cos(j);
      for (let i = 0; i < tmp0; i += 0.02) {
        // i <=> phi
        const
          [sp, cp] = sin_cos(i),
          h = ct + 2, // R1 + R2*cos(theta)
          sph = sp * h,
          D = 1 / (sph * sA + st * cA + 5), // this is 1/z
          t = sph * cA - st * sA; // this is a clever factoring of some of the terms in x' and y'

        const
          cph = cp * h,
          x = 0 | (40 + 30 * D * (cph * cB - t * sB)),
          y = 0 | (12 + 15 * D * (cph * sB + t * cB)),
          o = x + m * y,
          spct = sp * ct,
          N = 0 | (8 * (
            (st * sA - spct * cA) * cB -
            spct * sA -
            st * cA -
            cp * ct * sB
          ));

        if (inRange(y, 0, 22) && inRange(x, 0, m - 1) && D > z[o]) {
          z[o] = D;
          b[o] = ".,-~:;=!*#$@"[Math.max(N, 0)];
        }
      }
    }
    pretag.innerHTML = b.join("");
  };

  const next_frame = (/**@type {number}*/ now) => {
    if (now - start > 50) {
      start = now;
      base_frame();
    }
    RAF(next_frame);
  }
  RAF(next_frame);
};
