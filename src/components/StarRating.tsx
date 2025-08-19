// components/StarRating.tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  rating: number;
  onChange: (value: number) => void;
};

export default function StarRating({ rating, onChange }: Props) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (value: number) => {
    onChange(value);
  };

  const handleMouseOver = (value: number) => {
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const full = hoverValue !== null ? hoverValue >= i : rating >= i;
        const half = hoverValue !== null
          ? hoverValue >= i - 0.5 && hoverValue < i
          : rating >= i - 0.5 && rating < i;

        return (
          <div
            key={i}
            className="relative cursor-pointer"
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="absolute inset-0 w-1/2 z-10"
              onMouseEnter={() => handleMouseOver(i - 0.5)}
              onClick={() => handleClick(i - 0.5)}
            />
            <div
              className="absolute inset-0 left-1/2 w-1/2 z-10"
              onMouseEnter={() => handleMouseOver(i)}
              onClick={() => handleClick(i)}
            />
            <Star
              size={24}
              fill={full || half ? "#facc15" : "none"}
              stroke="#facc15"
            />
          </div>
        );
      })}
    </div>
  );
}
