import { useRef, useState, useEffect } from 'react';

interface UseDraggableOptions {
  initialPosition?: { x: number; y: number };
  bounds?: 'window' | 'parent' | null;
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const { initialPosition, bounds = 'window' } = options;
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;

      // Calculer le delta depuis la dernière position de la souris
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      // Utiliser la position actuelle du state, pas rect.left/rect.top
      let newX = position.x + deltaX;
      let newY = position.y + deltaY;

      // Appliquer les limites
      if (bounds === 'window') {
        const rect = elementRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }

      setPosition({ x: newX, y: newY });
      // Mettre à jour la position de référence pour le prochain delta
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, bounds, position.x, position.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Vérifier si on clique sur un élément interactif (bouton, input, etc.)
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select')
    ) {
      return;
    }

    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  return {
    ref: elementRef,
    position,
    isDragging,
    handleMouseDown,
    setPosition,
  };
}

