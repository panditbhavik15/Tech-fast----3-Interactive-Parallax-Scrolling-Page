import { memo, useMemo } from 'react'
import { mulberry32 } from '../lib/random'

/**
 * One SVG node per star layer keeps the DOM cheap: the whole field is a single
 * painted element that GSAP can translate, instead of hundreds of positioned divs.
 */
function StarField({
  count = 70,
  seed = 1,
  minRadius = 0.6,
  maxRadius = 1.9,
  opacity = 0.9,
  twinkleEvery = 0,
  className = '',
  color = '#ffffff',
}) {
  const stars = useMemo(() => {
    const rand = mulberry32(seed)
    return Array.from({ length: count }, (_, index) => ({
      cx: Number((rand() * 1440).toFixed(1)),
      cy: Number((rand() * 900).toFixed(1)),
      r: Number((minRadius + rand() * (maxRadius - minRadius)).toFixed(2)),
      o: Number((0.25 + rand() * 0.7).toFixed(2)),
      twinkle: twinkleEvery > 0 && index % twinkleEvery === 0,
      delay: Number((rand() * 5).toFixed(2)),
    }))
  }, [count, seed, minRadius, maxRadius, twinkleEvery])

  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      style={{ opacity, width: '100%', height: '100%' }}
    >
      {stars.map((star, index) => (
        <circle
          key={index}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill={color}
          opacity={star.o}
          className={star.twinkle ? 'twinkle' : undefined}
          style={star.twinkle ? { animationDelay: `${star.delay}s` } : undefined}
        />
      ))}
    </svg>
  )
}

export default memo(StarField)
