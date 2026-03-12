import * as React from 'react';
import { AnimatedDigit } from './AnimatedDigit';

export function AnimatedNumber({ value }: { value: number }) {
  const str = String(value);
  const prevRef = React.useRef(str);
  const prevStr = prevRef.current;

  React.useEffect(() => {
    prevRef.current = str;
  });

  const maxLen = Math.max(str.length, prevStr.length);
  const paddedCurrent = str.padStart(maxLen, ' ');

  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end' }}>
      {paddedCurrent.split('').map((digit, i) => (
        <AnimatedDigit key={i} digit={digit.trim() === '' ? '\u00A0' : digit} />
      ))}
    </span>
  );
}
