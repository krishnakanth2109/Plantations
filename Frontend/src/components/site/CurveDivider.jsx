import React from "react";
import { cn } from "../../lib/utils";

/**
 * CurveDivider
 * 
 * An elegant, organic curved SVG divider used to transition smoothly between sections.
 * Matches the premium design language of the Yogini Planters brand.
 * 
 * @param {string} fillColor - CSS color value (e.g., "#ffffff", "var(--background)")
 * @param {boolean} flip - Flips the curve horizontally for visual rhythm
 * @param {string} className - Additional classes for the wrapper
 * @param {string} strokeColor - CSS color for the subtle stroke, defaults to "rgba(203, 213, 225, 0.6)"
 * @param {boolean} flipVertical - Flips the curve vertically (so the flat part is on top)
 */
export function CurveDivider({
  fillColor = "currentColor",
  flip = false,
  flipVertical = false,
  className,
  strokeColor = "rgba(203, 213, 225, 0.6)",
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden leading-none pointer-events-none -mb-[1px]",
        flipVertical ? "-mt-[1px]" : "",
        className
      )}
      style={{
        transform: `scaleX(${flip ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
      }}
    >
      <style>{`
        @keyframes premium-wave-float {
          0%, 100% {
            transform: translate(0px, 0px) scale(1.02);
          }
          50% {
            transform: translate(5px, -3px) scale(1.02);
          }
        }
      `}</style>
      <svg
        viewBox="0 0 1440 200"
        className="relative block w-full h-16 sm:h-24 md:h-36 lg:h-48"
        preserveAspectRatio="none"
        style={{
          animation: "premium-wave-float 15s ease-in-out infinite"
        }}
      >
        {/* Wave Filled Area */}
        <path
          fill={fillColor}
          d="
            M 0,120 
            C 400,220 900,0 1440,100 
            L 1440,200 
            L 0,200 
            Z"
        />
        {/* Subtle Grey Border Line tracing the Curve */}
        {strokeColor && (
          <path
            d="
              M 0,120 
              C 400,220 900,0 1440,100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}
