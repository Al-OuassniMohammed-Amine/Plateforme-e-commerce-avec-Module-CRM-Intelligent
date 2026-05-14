'use client'

import { cn } from '@/lib/utils'

interface MoroccanPatternProps {
  className?: string
  variant?: 'default' | 'light' | 'gold'
}

export function MoroccanPattern({ className, variant = 'default' }: MoroccanPatternProps) {
  const patternColor = {
    default: 'stroke-foreground',
    light: 'stroke-background',
    gold: 'stroke-accent',
  }[variant]

  return (
    <svg
      className={cn('pointer-events-none', className)}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={`moroccan-${variant}`}
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Central star */}
          <path
            d="M30 10 L35 25 L50 25 L38 33 L42 48 L30 40 L18 48 L22 33 L10 25 L25 25 Z"
            fill="none"
            className={patternColor}
            strokeWidth="0.5"
          />
          {/* Connecting lines */}
          <path
            d="M0 0 L15 15 M60 0 L45 15 M0 60 L15 45 M60 60 L45 45"
            fill="none"
            className={patternColor}
            strokeWidth="0.3"
          />
          {/* Corner diamonds */}
          <path
            d="M0 30 L10 30 M50 30 L60 30 M30 0 L30 10 M30 50 L30 60"
            fill="none"
            className={patternColor}
            strokeWidth="0.3"
          />
          {/* Small decorative elements */}
          <circle cx="0" cy="0" r="2" fill="none" className={patternColor} strokeWidth="0.3" />
          <circle cx="60" cy="0" r="2" fill="none" className={patternColor} strokeWidth="0.3" />
          <circle cx="0" cy="60" r="2" fill="none" className={patternColor} strokeWidth="0.3" />
          <circle cx="60" cy="60" r="2" fill="none" className={patternColor} strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#moroccan-${variant})`} />
    </svg>
  )
}

export function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-8 w-full overflow-hidden', className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="40" height="20" viewBox="0 0 40 20" className="fill-accent">
          <path d="M20 0 L25 10 L20 20 L15 10 Z" />
          <path d="M10 5 L15 10 L10 15 L5 10 Z" />
          <path d="M30 5 L35 10 L30 15 L25 10 Z" />
        </svg>
      </div>
    </div>
  )
}
