"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type WindowedListProps<T> = {
  items: T[];
  estimateSize?: number;
  overscan?: number;
  className?: string;
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
};

const DEFAULT_ESTIMATE = 72;
const DEFAULT_OVERSCAN = 6;
const VIRTUALIZE_THRESHOLD = 50;

export function WindowedList<T>({
  items,
  estimateSize = DEFAULT_ESTIMATE,
  overscan = DEFAULT_OVERSCAN,
  className,
  getKey,
  renderItem,
}: WindowedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateViewport = () => {
      setViewportHeight(node.clientHeight);
    };

    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (items.length <= VIRTUALIZE_THRESHOLD) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={getKey(item, index)}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  const startIndex = Math.max(0, Math.floor(scrollTop / estimateSize) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + viewportHeight) / estimateSize) + overscan,
  );
  const topSpacer = startIndex * estimateSize;
  const bottomSpacer = Math.max(0, (items.length - endIndex) * estimateSize);
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      ref={containerRef}
      className={className}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      style={{ maxHeight: "min(70vh, 640px)", overflowY: "auto" }}
    >
      <div style={{ height: topSpacer }} aria-hidden />
      {visibleItems.map((item, index) => {
        const absoluteIndex = startIndex + index;
        return (
          <div key={getKey(item, absoluteIndex)}>
            {renderItem(item, absoluteIndex)}
          </div>
        );
      })}
      <div style={{ height: bottomSpacer }} aria-hidden />
    </div>
  );
}
