"use client";

import dynamic from 'next/dynamic';
import PreviewBlock from '@/components/admin/preview';
import { EmptyWorkbench } from './EmptyWorkbench';
import type { Block } from "@/types/landing";

const Footer = dynamic(() => import("@/components/shared/footer"), { ssr: false });

type Props = {
  blocks: Block[];
};

export function PreviewPanel({ blocks }: Props) {
  return (
    <div className="col-span-8 bg-white overflow-y-auto max-h-[calc(100vh-140px)] border-l border-zinc-50">
      <div className="w-full">
        {blocks.length === 0 ? (
          <EmptyWorkbench />
        ) : (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
            {blocks.map(b => <PreviewBlock key={b.id} block={b} />)}
            <div className="bg-background border-t mt-6">
              <Footer />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
