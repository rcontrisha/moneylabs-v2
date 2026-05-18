import { useEffect, useState, useCallback } from 'react';
import type { Block, Payload } from '@/types/landing';
import { uid } from '@/types/landing';

export function useLandingBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetch('/api/admin/site-config')
      .then(r => r.json())
      .then(d => {
        const json = d?.landingDraft ?? d?.landingBlocks ?? null;
        if (json && Array.isArray(json)) setBlocks(json as Block[]);
        else setBlocks([]);
      })
      .catch(() => setBlocks([]));
  }, []);

  const addBlock = useCallback((type: string) => {
    const b: Block = {
      id: uid('b_'),
      type,
      payload: type === 'product-carousel'
        ? { mode: 'query' as const, name: 'NEW_ARRIVALS' }
        : { image: '', link: '' }
    };
    setBlocks(prev => [...prev, b]);
  }, []);

  const updateBlock = useCallback((id: string, patch: Partial<Payload>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, payload: { ...b.payload, ...patch } } : b));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  return { blocks, setBlocks, addBlock, updateBlock, removeBlock };
}
