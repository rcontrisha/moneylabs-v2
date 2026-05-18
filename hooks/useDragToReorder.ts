import { useRef, useCallback } from 'react';
import type { Block } from '@/types/landing';

export function useDragToReorder(
  blocks: Block[],
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
) {
  const dragIndex = useRef<number | null>(null);

  const onDragStart = useCallback((e: React.DragEvent, index: number) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from == null) return;
    setBlocks(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
    dragIndex.current = null;
  }, [setBlocks]);

  return { onDragStart, onDragOver, onDrop };
}
