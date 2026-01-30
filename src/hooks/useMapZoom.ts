import { useState, useCallback, useRef } from 'react';

interface Position {
  coordinates: [number, number];
  zoom: number;
}

// Responsive initial zoom: more zoomed in on mobile
const getInitialZoom = () => {
  const isMobile = window.innerWidth < 768;
  return isMobile ? 2.1 : 1.4;
};

export function useMapZoom() {
  const initialZoom = getInitialZoom();

  const [position, setPosition] = useState<Position>({
    coordinates: [95, 15],
    zoom: initialZoom,
  });
  const [isDragging, setIsDragging] = useState(false);
  const previousPosition = useRef<Position>({
    coordinates: [95, 15], // Match initial position to avoid false-positive drag on first interaction
    zoom: initialZoom,
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
