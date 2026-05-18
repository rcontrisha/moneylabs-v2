"use client";

import { useLandingBlocks } from "@/hooks/useLandingBlocks";
import { useDragToReorder } from "@/hooks/useDragToReorder";
import { useHeroModal } from "@/hooks/useHeroModal";
import { useProductCarouselModal } from "@/hooks/useProductCarouselModal";
import { Header } from "@/components/admin/cms/Header";
import { LibraryPanel } from "@/components/admin/cms/LibraryPanel";
import { PreviewPanel } from "@/components/admin/cms/PreviewPanel";
import { HeroModal } from "@/components/admin/HeroModal";
import { ProductCarouselModal } from "@/components/admin/ProductCarouselModal";

export default function ContentManagementPage() {
  const { blocks, setBlocks, addBlock, updateBlock, removeBlock } = useLandingBlocks();
  const heroModal = useHeroModal(blocks, updateBlock);
  const productModal = useProductCarouselModal(blocks, updateBlock);
  const drag = useDragToReorder(blocks, setBlocks);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="grid grid-cols-12 flex-1">
        <LibraryPanel
          blocks={blocks}
          onAdd={addBlock}
          onRemove={removeBlock}
          onEditHero={heroModal.open}
          onEditProduct={productModal.open}
          onDragStart={drag.onDragStart}
          onDragOver={drag.onDragOver}
          onDrop={drag.onDrop}
        />
        <PreviewPanel blocks={blocks} />
      </div>

      <HeroModal
        open={heroModal.isOpen}
        images={heroModal.images}
        onChangeImage={heroModal.onChangeImage}
        onAddImage={heroModal.onAddImage}
        onRemoveImage={heroModal.onRemoveImage}
        onClose={heroModal.close}
        onSave={heroModal.save}
      />

      <ProductCarouselModal
        open={productModal.isOpen}
        items={productModal.items}
        name={productModal.name}
        onChangeItem={productModal.changeItem}
        onAddItem={productModal.addItem}
        onRemoveItem={productModal.removeItem}
        onChangeName={productModal.changeName}
        onClose={productModal.close}
        onSave={productModal.save}
      />
    </div>
  );
}