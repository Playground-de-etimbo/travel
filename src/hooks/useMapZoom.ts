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
    // Only consider it a drag if position changed SIGNIFICANTLY
    // Increased thresholds to prevent micro-movements from blocking clicks
    const coordsChanged =
      Math.abs(endPosition.coordinates[0] - previousPosition.current.coordinates[0]) > 2 ||
      Math.abs(endPosition.coordinates[1] - previousPosition.current.coordinates[1]) > 2;
    const zoomChanged = Math.abs(endPosition.zoom - previousPosition.current.zoom) > 0.05;

    // Set dragging flag immediately based on movement - no timeout needed
    setIsDragging(coordsChanged || zoomChanged);

    setPosition(endPosition);
    previousPosition.current = endPosition;
  }, []);

  return { position, handleMoveStart, handleMoveEnd, isDragging };
}
