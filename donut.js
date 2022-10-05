"use strict";
/**@typedef {number|bigint|string} numstr*/
{
  const
    { sin, cos } = Math,
    inRange =
      (/**@type {numstr}*/ x, /**@type {numstr}*/ min, /**@type {numstr}*/ max) =>
        x >= min && x < max,
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
      cA = cos(A),
      sA = sin(A),
      cB = cos(B),
      sB = sin(B),
      tmp0 = 6.28;

    for (let j = 0; j < tmp0; j += 0.07) {
      // j <=> theta
      const
        ct = cos(j),
        st = sin(j);
      for (let i = 0; i < tmp0; i += 0.02) {
        // i <=> phi
        const
          sp = sin(i),
          cp = cos(i),
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

  /**@param {number} now*/
  const next_frame = now => {
    if (now - start > 50) {
      start = now;
      base_frame();
    }
    RAF(next_frame);
  }
  RAF(next_frame);
};