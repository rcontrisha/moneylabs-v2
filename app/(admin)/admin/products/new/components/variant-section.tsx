import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function VariantSection({ type, data, onChange }: any) {
  const add = () => onChange([...data, { 
    size: "", regularPrice: 0, salePrice: null, stock: 1, 
    condition: type === 'used' ? '9/10' : undefined,
    defects: type === 'used' ? "" : undefined,
    includes: type === 'used' ? "" : undefined
  }]);

  const update = (idx: number, field: string, val: string) => {
  const updated = [...data];
  // 🚀 FIX: Kasih fallback 0 kalau user ngosongin input biar gak jadi NaN 
  const parsedValue = field === 'regularPrice' || field === 'salePrice' || field === 'stock'
    ? (parseInt(val) || 0) 
    : val;

  updated[idx] = { ...updated[idx], [field]: parsedValue };
  onChange(updated);
};

  return (
    <div className="rounded-lg border border-zinc-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Inventory</h2>
          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 uppercase ${type === 'new' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>{type}</Badge>
        </div>
        <Button type="button" onClick={add} variant="outline" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest"><Plus className="mr-1 h-3 w-3" /> Add Size</Button>
      </div>

      <div className="space-y-3">
        {data.map((item: any, idx: number) => (
          <div key={idx} className="space-y-3 rounded-md bg-zinc-50/50 p-4 border border-zinc-100">
            <div className="flex items-end gap-3">
              <div className="w-20 space-y-1">
                <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Size</Label>
                <Input value={item.size} onChange={(e) => update(idx, 'size', e.target.value)} className="h-8 bg-white text-xs" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Reg. Price</Label>
                <Input type="number" value={item.regularPrice} onChange={(e) => update(idx, 'regularPrice', parseInt(e.target.value))} className="h-8 bg-white text-xs" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Sale Price</Label>
                <Input type="number" value={item.salePrice || ""} onChange={(e) => update(idx, 'salePrice', e.target.value ? parseInt(e.target.value) : null)} className="h-8 bg-white text-xs" placeholder="Optional" />
              </div>
              <div className="w-16 space-y-1">
                <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Stock</Label>
                <Input type="number" value={item.stock} onChange={(e) => update(idx, 'stock', parseInt(e.target.value))} className="h-8 bg-white text-xs" />
              </div>
              <Button type="button" onClick={() => onChange(data.filter((_: any, i: number) => i !== idx))} variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
            </div>

            {/* Khusus Field Used */}
            {type === 'used' && (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Condition</Label>
                  <Input value={item.condition} onChange={(e) => update(idx, 'condition', e.target.value)} className="h-8 bg-white text-xs" placeholder="e.g 9/10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Defects</Label>
                  <Input value={item.defects} onChange={(e) => update(idx, 'defects', e.target.value)} className="h-8 bg-white text-xs" placeholder="Pemisah koma" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Includes</Label>
                  <Input value={item.includes} onChange={(e) => update(idx, 'includes', e.target.value)} className="h-8 bg-white text-xs" placeholder="Pemisah koma" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}