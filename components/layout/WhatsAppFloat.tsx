'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { waOrderUrl } from '@/lib/whatsapp';

export function WhatsAppFloat() {
  const t = useTranslations('wa');
  const elRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    let dragging = false;
    let sx = 0, sy = 0, ix = 0, iy = 0, moved = false;

    function start(e: MouseEvent | TouchEvent) {
      if (!el) return;
      const t = 'touches' in e ? e.touches[0] : e;
      dragging = true; moved = false;
      sx = t.clientX; sy = t.clientY;
      const r = el.getBoundingClientRect();
      ix = r.left; iy = r.top;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.position = 'fixed';
      el.style.left = ix + 'px';
      el.style.top = iy + 'px';
      e.preventDefault();
    }
    function move(e: MouseEvent | TouchEvent) {
      if (!dragging || !el) return;
      const t = 'touches' in e ? e.touches[0] : e;
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      let nx = ix + dx;
      let ny = iy + dy;
      nx = Math.max(8, Math.min(window.innerWidth - 64, nx));
      ny = Math.max(8, Math.min(window.innerHeight - 64, ny));
      el.style.left = nx + 'px';
      el.style.top = ny + 'px';
      e.preventDefault();
    }
    function end() {
      if (moved) draggedRef.current = true;
      dragging = false;
    }

    el.addEventListener('mousedown', start);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
    el.addEventListener('touchstart', start, { passive: false });
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', end);

    return () => {
      el.removeEventListener('mousedown', start);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      el.removeEventListener('touchstart', start);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    };
  }, []);

  function handleClick() {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    window.open(waOrderUrl('Thermomix TM7', t('msg')), '_blank', 'noopener');
  }

  return (
    <div
      ref={elRef}
      className="wa-float"
      onClick={handleClick}
      role="button"
      aria-label={t('label')}
      title={t('label')}
    >
      <i className="fa-brands fa-whatsapp" />
      <span className="wa-float-label">{t('label')}</span>
    </div>
  );
}
