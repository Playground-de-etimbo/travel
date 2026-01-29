import { useState, useCallback, useRef } from 'react';

interface Position {
  coordinates: [number, number];
  zoom: number;
}

export function useMapZoom() {
  const [position, setPosition] = useState<Position>({
    coordinates: [95, 15],
    zoom: 1.4, // Initial zoom level (40% closer than default)
  });
  const [isDragging, setIsDragging] = useState(false);
  const previousPosition = useRef<Position>({
    coordinates: [0, 0],
    zoom: 1.4,
  });

  const handleMoveStart = useCallback(() => {
    // Don't set isDragging here - wait to see if position actually changes
  }, []);

  const handleMoveEnd = useCallback((endPosition: Position) => {
    // Only consider it a drag if position changed significantly
    const coordsChanged =
      Math.abs(endPosition.coordinates[0] - previousPosition.current.coordinates[0]) > 0.01 ||
      Math.abs(endPosition.coordinates[1] - previousPosition.current.coordinates[1]) > 0.01;
    const zoomChanged = Math.abs(endPosition.zoom - previousPosition.current.zoom) > 0.01;

    if (coordsChanged || zoomChanged) {
      setIsDragging(true);
      // Reset after a short delay
      setTimeout(() => setIsDragging(false), 100);
    } else {
      setIsDragging(false);
    }

    setPosition(endPosition);
    previousPosition.current = endPosition;
  }, []);

  return { position, handleMoveStart, handleMoveEnd, isDragging };
}
