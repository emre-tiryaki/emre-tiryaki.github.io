/**
 * TweetCard — MagicUI-style tweet card with image carousel
 *
 * Props:
 *   tweet: {
 *     id?:         string          // link için tweet id
 *     user: {
 *       name:                string
 *       handle:              string   // @ olmadan
 *       avatarUrl:           string
 *       verified?:           boolean
 *       profileUrl?:         string
 *     }
 *     text:        string          // ham tweet metni
 *     entities?: {                 // parse edilecek mention/url/hashtag aralıkları
 *       mentions?: { text: string; url: string }[]
 *       urls?:     { text: string; url: string; displayUrl?: string }[]
 *       hashtags?: { text: string; url: string }[]
 *     }
 *     images?:     string[]        // carousel'a girecek URL'ler
 *     createdAt?:  string          // "Oct 15, 2023" gibi
 *   }
 *   className?:  string
 */

import { useRef, useState } from 'react';

/* ── İkonlar ── */
const TwitterIcon = ({ className = '', ...props }) => (
  <svg
    stroke="currentColor" fill="currentColor" strokeWidth="0"
    viewBox="0 0 24 24" height="1em" width="1em"
    xmlns="http://www.w3.org/2000/svg"
    className={className} {...props}
  >
    <g>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
    </g>
  </svg>
);

const VerifiedIcon = ({ className = '', ...props }) => (
  <svg
    aria-label="Verified Account" viewBox="0 0 24 24"
    height="1em" width="1em"
    className={className} {...props}
  >
    <g fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </g>
  </svg>
);

/* ── Metin parser: mention (@), hashtag (#), url'leri renkli link yapar ── */
function parseTweetText(text, entities = {}) {
  if (!text) return null;

  // Tüm entity'leri işaretçi listesine ekle
  const markers = [];

  (entities.mentions || []).forEach(({ text: t, url }) => {
    let idx = text.indexOf(t);
    while (idx !== -1) {
      markers.push({ start: idx, end: idx + t.length, type: 'mention', display: t, url });
      idx = text.indexOf(t, idx + 1);
    }
  });

  (entities.hashtags || []).forEach(({ text: t, url }) => {
    let idx = text.indexOf(t);
    while (idx !== -1) {
      markers.push({ start: idx, end: idx + t.length, type: 'hashtag', display: t, url });
      idx = text.indexOf(t, idx + 1);
    }
  });

  (entities.urls || []).forEach(({ text: t, url, displayUrl }) => {
    let idx = text.indexOf(t);
    while (idx !== -1) {
      markers.push({ start: idx, end: idx + t.length, type: 'url', display: displayUrl || t, url });
      idx = text.indexOf(t, idx + 1);
    }
  });

  // Çakışmaları temizle, sırala
  markers.sort((a, b) => a.start - b.start);
  const clean = [];
  let cursor = 0;
  for (const m of markers) {
    if (m.start < cursor) continue;
    clean.push(m);
    cursor = m.end;
  }

  // Parçalara böl
  const parts = [];
  let pos = 0;
  for (const m of clean) {
    if (m.start > pos) parts.push({ type: 'text', text: text.slice(pos, m.start) });
    parts.push(m);
    pos = m.end;
  }
  if (pos < text.length) parts.push({ type: 'text', text: text.slice(pos) });

  return parts.map((part, i) => {
    if (part.type === 'text') {
      return (
        <span key={i} className="text-[15px] font-normal text-neutral-800 dark:text-neutral-200">
          {part.text}
        </span>
      );
    }
    return (
      <a
        key={i}
        href={part.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[15px] font-normal text-sky-500 hover:underline transition-colors"
      >
        {part.display}
      </a>
    );
  });
}

/* ── Image Carousel ── */
function ImageCarousel({ images }) {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) return null;

  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, clientWidth } = trackRef.current;
    setActiveIdx(Math.round(scrollLeft / (clientWidth * 0.85)));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
      {/* Scrollable track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto gap-2 px-2 py-2 no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Leading spacer */}
        <div className="shrink-0 snap-center w-0" />

        {images.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 snap-center snap-always"
            style={{ width: '85%' }}
          >
            <img
              src={src}
              alt={`Photo ${i + 1}`}
              loading="lazy"
              className="w-full h-64 object-cover rounded-xl shadow-sm"
              style={{ display: 'block' }}
            />
          </div>
        ))}

        {/* Trailing spacer */}
        <div className="shrink-0 snap-center w-0" />
      </div>

      {/* Dot indicators — only when multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!trackRef.current) return;
                const itemW = trackRef.current.clientWidth * 0.85 + 8; // 8 = gap
                trackRef.current.scrollTo({ left: i * itemW, behavior: 'smooth' });
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'w-5 bg-white shadow-md'
                  : 'w-1.5 bg-white/50'
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Ana bileşen ── */
export default function TweetCard({ tweet, className = '' }) {
  if (!tweet) return null;

  const { user, text, entities = {}, images = [], createdAt, id } = tweet;
  const tweetUrl = id
    ? `https://twitter.com/${user.handle}/status/${id}`
    : (user.profileUrl || `https://twitter.com/${user.handle}`);
  const profileUrl = user.profileUrl || `https://twitter.com/${user.handle}`;

  return (
    <div
      className={`
        relative flex w-full max-w-lg flex-col gap-4 overflow-hidden rounded-2xl
        bg-white dark:bg-neutral-900
        border border-black/[0.08] dark:border-white/10
        shadow-sm hover:shadow-md
        p-5 transition-shadow duration-300
        ${className}
      `}
    >
      {/* ── Header ── */}
      <div className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <a href={profileUrl} target="_blank" rel="noreferrer" className="shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              width={48}
              height={48}
              className="size-12 rounded-full border border-black/10 dark:border-white/10 object-cover"
            />
          </a>

          {/* Name + Handle */}
          <div className="flex flex-col gap-0.5">
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-semibold text-[15px] text-neutral-900 dark:text-neutral-100 whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              {user.name}
              {user.verified && (
                <VerifiedIcon className="size-[1.1em] text-sky-500" />
              )}
            </a>
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              @{user.handle}
            </a>
          </div>
        </div>

        {/* Twitter icon */}
        <a
          href={tweetUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="View on Twitter"
        >
          <TwitterIcon className="text-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:scale-105 transition-all ease-in-out" />
        </a>
      </div>

      {/* ── Body ── */}
      <div className="text-[15px] leading-relaxed tracking-normal break-words">
        {parseTweetText(text, entities)}
      </div>

      {/* ── Image Carousel ── */}
      {images.length > 0 && <ImageCarousel images={images} />}

      {/* ── Footer (tarih) ── */}
      {createdAt && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
          {createdAt}
        </p>
      )}
    </div>
  );
}
