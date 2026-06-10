'use client';
import { useState } from 'react';

export function PDPGallery({ imageIds, alt }: { imageIds: string[]; alt: string }) {
  const [active, setActive] = useState(imageIds[0]);
  return (
    <div className="pdp-gallery">
      <div className="pdp-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://images.unsplash.com/${active}?w=800&q=80`} alt={alt} />
      </div>
      <div className="pdp-thumbs">
        {imageIds.map((id) => (
          <button
            key={id}
            type="button"
            className={`pdp-thumb${id === active ? ' on' : ''}`}
            onClick={() => setActive(id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://images.unsplash.com/${id}?w=150&q=70`} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
