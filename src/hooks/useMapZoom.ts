import { useState, useCallback } from 'react';

interface Position {
  coordinates: [number, number];
  zoom: number;
}

export function useMapZoom() {
  const [position, setPosition] = useState<Position>({
    coordinates: [0, 0],
    zoom: 1.4, // Initial zoom level (40% closer than default)
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleMoveStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMoveEnd = useCallback((position: Position) => {
    setPosition(position);
    // Small delay to prevent accidental clicks after dragging
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  return { position, handleMoveStart, handleMoveEnd, isDragging };
}
