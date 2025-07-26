'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className, 'text-black dark:text-white')}
    >
      {/* The Body/Ghost Shape */}
      <path 
        d="M100,20 C40,20 40,120 40,120 L40,180 L160,180 L160,120 C160,120 160,20 100,20 Z" 
        fill="currentColor"
        className="ghost-body"
      />

      {/* The Face - Terminal prompt >_ */}
      <g className="ghost-face">
        {/* The > symbol - same as favicon */}
        <path 
          d="M65 85 L95 105 L65 125" 
          stroke="#000000" 
          strokeWidth="25" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* The _ symbol - same as favicon */}
        <line 
          x1="85" 
          y1="125" 
          x2="135" 
          y2="125" 
          stroke="#000000" 
          strokeWidth="25" 
          strokeLinecap="round"
        />
      </g>

      <style jsx>{`
        .ghost-body { color: #000000; }
        .ghost-face { color: #000000; }
        
        @media (prefers-color-scheme: dark) {
          .ghost-body { color: #FFFFFF; }
          .ghost-face { color: #000000; }
          .ghost-face path { stroke: #000000 !important; }
          .ghost-face line { stroke: #000000 !important; }
        }
      `}</style>
    </svg>
  )
}
