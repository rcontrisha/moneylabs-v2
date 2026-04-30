import { Brand, Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneralInfoProps {
  brands: Brand[];
  categories: Category[];
  sku: string;
  onNameChange: (name: string) => void;
  onBrandChange: (id: string) => void;
  nameDefault?: string;
  brandDefault?: string;
  categoryDefault?: string;
  shortDescDefault?: string;
}

export function GeneralInfo({ brands, categories, sku, onNameChange, onBrandChange, nameDefault, brandDefault, categoryDefault, shortDescDefault }: GeneralInfoProps) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-bold text-zinc-900 mb-5 uppercase tracking-tight">General Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-zinc-500 uppercase">Product Name</Label>
            <Input 
              name="name" 
              defaultValue={nameDefault}
              placeholder="Adidas Samba OG White Black" 
              className="h-9 border-zinc-200 text-sm focus-visible:ring-zinc-950" 
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-zinc-400 uppercase">Auto-Generated SKU</Label>
            <Input 
              value={sku} 
              readOnly 
              placeholder="GEN-AUTO-XXXX" 
              className="h-9 border-zinc-100 bg-zinc-50/50 text-zinc-500 text-xs font-mono font-bold" 
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-zinc-500 uppercase">Brand</Label>
            <Select name="brandId" defaultValue={brandDefault} onValueChange={onBrandChange}>
              <SelectTrigger className="h-9 border-zinc-200 text-xs focus:ring-zinc-950"><SelectValue placeholder="Select Brand" /></SelectTrigger>
              <SelectContent>
                {brands.map(b => <SelectItem key={b.id} value={b.id} className="text-xs uppercase font-medium">{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-zinc-500 uppercase">Category</Label>
            <Select name="categoryId" defaultValue={categoryDefault}>
              <SelectTrigger className="h-9 border-zinc-200 text-xs focus:ring-zinc-950"><SelectValue placeholder="Select Category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.id} className="text-xs uppercase font-medium">{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-zinc-500 uppercase">Status</Label>
            <Select name="stockStatus" defaultValue="instock">
              <SelectTrigger className="h-9 border-zinc-200 text-xs focus:ring-zinc-950"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="instock" className="text-xs uppercase font-medium text-green-600">In Stock</SelectItem>
                <SelectItem value="outofstock" className="text-xs uppercase font-medium text-red-600">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold text-zinc-500 uppercase">Short Description</Label>
          <Textarea name="shortDesc" defaultValue={shortDescDefault} placeholder="Brief catchphrase for product cards..." className="h-16 border-zinc-200 text-xs focus-visible:ring-zinc-950" />
        </div>
      </div>
    </div>
  );
}