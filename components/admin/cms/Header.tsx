"use client";

import { Button } from "@/components/ui/button";
import { Save, Rocket } from "lucide-react";

export function Header() {
  return (
    <div className="border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-50 p-4">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-black italic">Content Management</h1>
        <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-bold">Homepage Layout & Global Sections</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-none border-zinc-200 text-[10px] font-black uppercase tracking-widest h-10 px-6">
          <Save size={14} className="mr-2" /> Save Draft
        </Button>
        <Button className="rounded-none bg-black hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-[0.2em] h-10 px-10 shadow-xl shadow-lime-400/20">
          Publish Changes <Rocket size={14} className="ml-2 text-lime-400" />
        </Button>
      </div>
    </div>
  );
}
