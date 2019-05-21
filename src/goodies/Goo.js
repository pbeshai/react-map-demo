import React from 'react';

let gooId = 0;

// see https://css-tricks.com/gooey-effect/
export default function Goo({ children }) {
  const id = React.useMemo(() => gooId++, []);

  return (
    <g filter={`url(#${id})`}>
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      {children}
    </g>
  );
}
