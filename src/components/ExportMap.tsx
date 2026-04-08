'use client';

import { RevealOnScroll } from '@/components/Motion';

interface ExportMapDict {
  heading: string;
  highlight: string;
  istanbul: string;
  activeMarkets: string;
  expanding: string;
}

export default function ExportMap({ dict }: { dict: ExportMapDict }) {
  return (
    <RevealOnScroll>
      <div className="mt-20">
        <h3 className="mb-8 text-center font-display text-2xl font-bold">
          {dict.heading} <span className="accent">{dict.highlight}</span>
        </h3>

        <div className="relative overflow-hidden rounded-2xl border border-brand-sand/60 bg-white">
          {/* Simplified SVG map */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ocean */}
            <rect width="1000" height="500" fill="#F3F0E8" />

            {/* Europe (active) */}
            <path
              d="M420 70 L460 60 L520 65 L560 80 L580 110 L560 150 L520 170 L480 180 L440 170 L420 160 L400 140 L380 110 Z"
              fill="rgba(201,168,76,0.2)"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />

            {/* Scandinavia (active) */}
            <path
              d="M440 30 L460 20 L500 25 L520 50 L500 70 L460 65 L440 50 Z"
              fill="rgba(201,168,76,0.2)"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />

            {/* Africa */}
            <path
              d="M400 190 L460 180 L520 190 L540 225 L530 290 L500 330 L470 350 L440 340 L400 300 L380 250 L380 220 Z"
              fill="#E8E3D8"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />

            {/* Asia */}
            <path
              d="M580 90 L650 70 L720 70 L800 90 L850 110 L880 150 L850 190 L780 210 L700 200 L640 180 L580 160 Z"
              fill="#E8E3D8"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />

            {/* North America */}
            <path
              d="M50 60 L120 40 L200 50 L240 80 L220 130 L180 170 L140 190 L100 180 L60 140 L40 100 Z"
              fill="#E8E3D8"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />

            {/* South America */}
            <path
              d="M180 220 L220 210 L260 240 L270 290 L240 340 L200 380 L170 360 L150 300 L160 250 Z"
              fill="#E8E3D8"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />

            {/* Istanbul hub */}
            <circle cx="540" cy="140" r="6" fill="#C9A84C" />
            <circle cx="540" cy="140" r="12" stroke="rgba(201,168,76,0.35)" strokeWidth="1.5" fill="none" />
            <circle cx="540" cy="140" r="20" stroke="rgba(201,168,76,0.12)" strokeWidth="1" fill="none" />
            <text x="555" y="144" fill="#D4BC6A" fontSize="10" fontFamily="Space Grotesk, sans-serif" fontWeight="600">
              {dict.istanbul}
            </text>

            {/* Destination dots with lines */}
            {[
              [460, 50],  // Stockholm
              [480, 90],  // Berlin
              [440, 105], // Paris
              [420, 90],  // London
              [480, 135], // Milan
              [440, 140], // Madrid
              [500, 95],  // Warsaw
              [460, 70],  // Copenhagen
              [490, 75],  // Helsinki
              [430, 130], // Lisbon
              [460, 110], // Brussels
              [470, 100], // Amsterdam
            ].map(([x, y], i) => (
              <g key={i}>
                <line x1={540} y1={140} x2={x} y2={y} stroke="rgba(201,168,76,0.08)" strokeWidth="0.5" />
                <circle cx={x} cy={y} r="3" fill="rgba(212,188,106,0.6)" />
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-4 flex justify-center gap-8 text-xs text-brand-grey">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-accent-light" />
            {dict.activeMarkets}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-sand-dark" />
            {dict.expanding}
          </span>
        </div>
      </div>
    </RevealOnScroll>
  );
}
