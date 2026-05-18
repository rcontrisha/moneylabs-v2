import { useState, useCallback } from 'react';
import type { Block, Payload } from '@/types/landing';

type Item = { image?: string; title?: string; brand?: string; price?: string };

export function useProductCarouselModal(
  blocks: Block[],
  updateBlock: (id: string, patch: Partial<Payload>) => void
) {
  const [open, setOpen] = useState(false);
  const [blockId, setBlockId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');

  const openModal = useCallback((block: Block) => {
    setBlockId(block.id);
    const rawItems = (block.payload.params as any)?.items ?? [];
    setItems(rawItems.slice ? rawItems.slice() : []);
    setName(block.payload.name ?? '');
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setBlockId(null);
  }, []);

  const save = useCallback(() => {
    if (!blockId) return close();
    const block = blocks.find(b => b.id === blockId);
    const existingParams = (block?.payload.params as any) ?? {};
    updateBlock(blockId, { params: { ...existingParams, items }, name });
    close();
  }, [blockId, blocks, items, name, updateBlock, close]);

  const changeItem = useCallback((index: number, patch: Partial<Item>) => {
    setItems(prev => {
      const next = prev.slice();
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  const addItem = useCallback(() => {
    setItems(prev => [...prev, { image: '', title: '', brand: '', price: '' }]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    open: openModal,
    close,
    save,
    isOpen: open,
    items,
    name,
    changeItem,
    addItem,
    removeItem,
    changeName: setName,
  };
}
