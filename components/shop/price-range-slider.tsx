"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface PriceRangeSliderProps {
  maxPrice: number;
}

const formatPrice = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);

const inputClass =
  "w-full border border-zinc-200 bg-white px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300";

export default function PriceRangeSlider({ maxPrice }: PriceRangeSliderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlMin = Math.max(0, Number(searchParams.get("minPrice")) || 0);
  const urlMax = Math.min(maxPrice, Number(searchParams.get("maxPrice")) || maxPrice);

  const [localMin, setLocalMin] = useState(urlMin);
  const [localMax, setLocalMax] = useState(urlMax);

  const minRef = useRef(urlMin);
  const maxRef = useRef(urlMax);

  useEffect(() => {
    setLocalMin(urlMin);
    setLocalMax(urlMax);
    minRef.current = urlMin;
    maxRef.current = urlMax;
  }, [urlMin, urlMax]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushToUrl = useCallback(
    (min: number, max: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (min > 0) params.set("minPrice", String(min));
      else params.delete("minPrice");
      if (max < maxPrice) params.set("maxPrice", String(max));
      else params.delete("maxPrice");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, maxPrice],
  );

  const promoteImmediate = useCallback(
    (min: number, max: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      pushToUrl(min, max);
    },
    [pushToUrl],
  );

  const promoteDebounced = useCallback(
    (min: number, max: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => pushToUrl(min, max), 600);
    },
    [pushToUrl],
  );

  const clamp = (min: number, max: number) => {
    const clampedMin = Math.max(0, Math.min(min, maxPrice));
    const clampedMax = Math.min(maxPrice, Math.max(max, 0));
    return [clampedMin, clampedMax] as const;
  };

  const handleSliderMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const [clampedMin] = clamp(val, maxRef.current);
    minRef.current = clampedMin;
    setLocalMin(clampedMin);
  };

  const handleSliderMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const [, clampedMax] = clamp(minRef.current, val);
    maxRef.current = clampedMax;
    setLocalMax(clampedMax);
  };

  const handleSliderRelease = () => {
    promoteImmediate(minRef.current, maxRef.current);
  };

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) || 0;
    setLocalMin(val);
    promoteDebounced(val, localMax);
  };

  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) || 0;
    setLocalMax(val);
    promoteDebounced(localMin, val);
  };

  const handleMinBlur = () => promoteImmediate(localMin, localMax);
  const handleMaxBlur = () => promoteImmediate(localMin, localMax);

  const handleMinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") promoteImmediate(localMin, localMax);
  };

  const handleMaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") promoteImmediate(localMin, localMax);
  };

  if (maxPrice <= 0) {
    return (
      <div className="flex items-center gap-2">
        <input type="number" placeholder="Min" className={inputClass} disabled />
        <span className="text-zinc-300 text-xs">—</span>
        <input type="number" placeholder="Max" className={inputClass} disabled />
      </div>
    );
  }

  const minPercent = (localMin / maxPrice) * 100;
  const maxPercent = (localMax / maxPrice) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={localMin || ""}
          onChange={handleMinInput}
          onBlur={handleMinBlur}
          onKeyDown={handleMinKeyDown}
          className={inputClass}
        />
        <span className="text-zinc-300 text-xs">—</span>
        <input
          type="number"
          placeholder="Max"
          value={localMax === maxPrice ? "" : localMax || ""}
          onChange={handleMaxInput}
          onBlur={handleMaxBlur}
          onKeyDown={handleMaxKeyDown}
          className={inputClass}
        />
      </div>

      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1 bg-zinc-200 rounded" />
        <div
          className="absolute h-1 bg-black rounded"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={Math.ceil(maxPrice / 200)}
          value={localMin}
          onChange={handleSliderMin}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="absolute w-full h-5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={Math.ceil(maxPrice / 200)}
          value={localMax}
          onChange={handleSliderMax}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="absolute w-full h-5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-[9px] text-zinc-400 font-mono select-none">
        <span>{formatPrice(0)}</span>
        <span>{formatPrice(maxPrice)}</span>
      </div>
    </div>
  );
}
