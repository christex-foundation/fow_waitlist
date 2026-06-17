import type { SVGProps } from 'react'

/**
 * The Lion Mountains — Sierra Leone literally means "Serra Lyoa", the lion-shaped
 * peaks above Freetown. This is the page's one signature: a hand-drawn ridge that
 * recurs as a structural device (hero backdrop, section markers).
 *
 * Colour comes from `currentColor`, so set it with a text-* class on the caller
 * (e.g. `className="text-indigo"`). Always decorative — rendered aria-hidden.
 */

// A single ridge with one dominant peak (Sugar Loaf) and uneven supporting
// summits, so it reads as drawn by hand rather than a tidy triangle.
const RIDGE =
  'M0 158 L40 131 L72 145 L106 95 L134 121 L172 150 L210 50 L248 123 L278 99 L314 150 L346 114 L382 139 L418 119 L454 145 L480 133'

type PeaksProps = {
  /** 'line' = open ridge stroke (markers/dividers). 'fill' = solid silhouette (hero backdrop). */
  variant?: 'line' | 'fill'
  strokeWidth?: number
} & Omit<SVGProps<SVGSVGElement>, 'viewBox'>

export default function Peaks({
  variant = 'line',
  strokeWidth = 4,
  ...props
}: PeaksProps) {
  const isFill = variant === 'fill'

  return (
    <svg
      viewBox="0 0 480 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio={isFill ? 'none' : 'xMidYMid meet'}
      {...props}
    >
      <path
        d={isFill ? `${RIDGE} L480 200 L0 200 Z` : RIDGE}
        stroke={isFill ? 'none' : 'currentColor'}
        fill={isFill ? 'currentColor' : 'none'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect={isFill ? undefined : 'non-scaling-stroke'}
      />
    </svg>
  )
}
