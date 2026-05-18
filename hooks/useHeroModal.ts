import { useState, useCallback } from 'react';
import type { Block, Payload } from '@/types/landing';

export function useHeroModal(
  blocks: Block[],
  updateBlock: (id: string, patch: Partial<Payload>) => void
) {
  const [open, setOpen] = useState(false);
  const [blockId, setBlockId] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const openHeroModal = useCallback((block: Block) => {
    setBlockId(block.id);
    const imgs = block.payload.images ?? (block.payload.image ? [block.payload.image] : []);
    setImages(imgs.slice());
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setBlockId(null);
    setImages([]);
  }, []);

  const save = useCallback(() => {
    if (!blockId) return close();
    updateBlock(blockId, { images, image: images[0] ?? '' });
    close();
  }, [blockId, images, updateBlock, close]);

  const onChangeImage = useCallback((index: number, value: string) => {
    setImages(prev => {
      const next = prev.slice();
      next[index] = value;
      return next;
    });
  }, []);

  const onAddImage = useCallback(() => {
    setImages(prev => [...prev, '']);
  }, []);

  const onRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    open: openHeroModal,
    close,
    save,
    isOpen: open,
    images,
    onChangeImage,
    onAddImage,
    onRemoveImage,
    blockId,
  };
}
