'use client'

import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeMap = {
    sm: { container: 'w-8 h-8', svg: 'w-8 h-8' },
    md: { container: 'w-12 h-12', svg: 'w-12 h-12' },
    lg: { container: 'w-16 h-16', svg: 'w-16 h-16' }
  }

  const { container, svg } = sizeMap[size]

  return (
    <div 
      className={`terminal-ghost-logo relative flex items-center justify-center ${container} ${className}`}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .terminal-ghost-logo .body-shape {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .terminal-ghost-logo .face-element {
            transition: transform 0.4s ease-out;
            transform-origin: center;
          }

          .terminal-ghost-logo:hover .body-shape {
            transform: scale(1.05);
          }
          
          .terminal-ghost-logo:hover .face-element {
            transform: scale(1.1) rotate(5deg);
          }
        `
      }} />
      
      <svg 
        className={`terminal-ghost-svg ${svg}`} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The Body/Ghost Shape */}
        <path 
          className="body-shape" 
          d="M100,20 C40,20 40,120 40,120 L40,180 L160,180 L160,120 C160,120 160,20 100,20 Z" 
          fill="#FFFFFF"
        />

        {/* The Face, constructed from the terminal prompt >_ */}
        <g className="face-element">
          <path 
            d="M80 85 L100 105 L80 125" 
            stroke="#000000" 
            strokeWidth="15" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <line 
            x1="110" 
            y1="125" 
            x2="140" 
            y2="125" 
            stroke="#000000" 
            strokeWidth="15" 
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}
