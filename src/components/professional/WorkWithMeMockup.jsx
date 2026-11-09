import { AnimatePresence, motion } from 'framer-motion';
import {
  FiStar, FiSmartphone, FiHome, FiShoppingBag, FiCalendar, FiUsers, FiBarChart2,
  FiCpu, FiSend, FiFileText, FiZap, FiShoppingCart, FiMail, FiPackage, FiBell,
  FiCheckCircle, FiCheck, FiSearch, FiMessageSquare,
} from 'react-icons/fi';

/**
 * Wide browser-window mockup for the /work-with-me hero.
 * Renders one "scene" per showcase (see hero.showcases in data/professional.js)
 * and cross-fades between them when `showcase` changes. Purely decorative.
 */

const enter = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.4, ease: 'easeOut' } },
});

const initials = (name) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/* ------------------------------------------------------------------ Website */

const DISH_TILES = [
  'row-span-2 bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300',
  'bg-gradient-to-br from-emerald-200 to-teal-300',
  'bg-gradient-to-br from-rose-200 to-amber-200',
];

function WebsiteScene({ c }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 font-bold text-slate-900 text-sm sm:text-base">
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-white grid place-items-center text-xs font-extrabold">
            {initials(c.brand)}
          </span>
          {c.brand}
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
          {c.nav.map((item) => <span key={item}>{item}</span>)}
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold whitespace-nowrap">
          {c.navCta}
        </span>
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 px-5 sm:px-8 lg:px-12 py-6 items-center">
        <div className="min-w-0">
          <motion.div {...enter(0.05)} className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">
            {c.kicker}
          </motion.div>
          <motion.div {...enter(0.12)} className="text-2xl sm:text-3xl lg:text-[2.5rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-3">
            {c.title}
          </motion.div>
          <motion.p {...enter(0.2)} className="text-sm text-slate-500 mb-6 max-w-sm">
            {c.text}
          </motion.p>
          <motion.div {...enter(0.28)} className="flex flex-wrap items-center gap-4">
            <span className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold shadow-sm">
              {c.button}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <FiStar size={14} className="text-amber-500 fill-amber-500" />
              {c.rating}
            </span>
          </motion.div>
        </div>

        <div className="hidden md:grid relative grid-cols-2 grid-rows-2 gap-3 h-full max-h-72">
          {c.dishes.map((dish, i) => (
            <motion.div
              key={dish.name}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 + i * 0.1, duration: 0.45 } }}
              className={`relative rounded-2xl overflow-hidden ${DISH_TILES[i]}`}
            >
              <span className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-white/55 ring-8 ring-white/25 ${i === 0 ? 'top-[22%] w-28 h-28' : 'top-[14%] w-14 h-14'}`} />
              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-white/90 text-xs">
                <span className="font-semibold text-slate-800 truncate">{dish.name}</span>
                <span className="font-bold text-amber-600">{dish.price}</span>
              </div>
            </motion.div>
          ))}
          <motion.span
            {...enter(0.5)}
            className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-md text-[11px] font-semibold text-slate-700"
          >
            <FiSmartphone size={12} className="text-emerald-600" />
            {c.badge}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Dashboard */

const NAV_ICONS = [FiHome, FiShoppingBag, FiCalendar, FiUsers, FiBarChart2];
const BAR_HEIGHTS = [42, 58, 50, 72, 64, 92, 78];

function DashboardScene({ c }) {
  return (
    <div className="h-full flex bg-slate-50">
      <aside className="hidden md:flex w-48 lg:w-52 shrink-0 flex-col gap-1 p-4 bg-white border-r border-slate-200">
        <div className="flex items-center gap-2 px-2 pb-4 text-sm font-bold text-slate-900">
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white grid place-items-center">
            <FiBarChart2 size={14} />
          </span>
          {c.brand}
        </div>
        {c.nav.map((item, i) => {
          const Icon = NAV_ICONS[i] || FiHome;
          return (
            <span
              key={item}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium ${
                i === 0 ? 'bg-blue-50 text-blue-700' : 'text-slate-500'
              }`}
            >
              <Icon size={14} />
              {item}
            </span>
          );
        })}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col gap-4 p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold text-slate-900 truncate">{c.title}</div>
            <div className="text-xs sm:text-sm text-slate-500 truncate">{c.subtitle}</div>
          </div>
          <span className="shrink-0 text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            {c.filter}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {c.metrics.map((m, i) => (
            <motion.div key={m.label} {...enter(0.05 + i * 0.07)} className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">{m.label}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">{m.value}</span>
                <span className="hidden sm:inline text-[11px] font-semibold text-emerald-600">{m.diff}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 min-h-0 grid md:grid-cols-[1.5fr_1fr] gap-4">
          <div className="min-h-0 flex flex-col p-4 rounded-xl bg-white border border-slate-200">
            <div className="text-sm font-semibold text-slate-900 mb-3">{c.chartTitle}</div>
            <div className="flex-1 min-h-0 flex items-end gap-2 sm:gap-3">
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1, transition: { delay: 0.15 + i * 0.05, duration: 0.5, ease: 'easeOut' } }}
                    style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                    className={`w-full rounded-md ${i === 5 ? 'bg-blue-600' : 'bg-blue-100'}`}
                  />
                  <span className="text-[10px] text-slate-400">{c.days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex min-h-0 flex-col p-4 rounded-xl bg-white border border-slate-200 overflow-hidden">
            <div className="text-sm font-semibold text-slate-900 mb-3">{c.listTitle}</div>
            <div className="flex flex-col gap-2">
              {c.list.map((row, i) => (
                <motion.div key={row.time} {...enter(0.25 + i * 0.08)} className="flex items-center gap-2.5 text-xs">
                  <span className="font-mono font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{row.time}</span>
                  <span className="flex-1 min-w-0 truncate font-medium text-slate-800">{row.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.confirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {row.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- AI chatbot */

function AiScene({ c }) {
  return (
    <div className="h-full grid md:grid-cols-[1.7fr_1fr] bg-white">
      <div className="min-h-0 flex flex-col md:border-r border-slate-100">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white grid place-items-center">
            <FiCpu size={16} />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900">{c.botName}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {c.status}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-end gap-2.5 px-5 py-4 bg-slate-50/60">
          {c.messages.map((msg, i) => {
            const isUser = msg.from === 'user';
            return (
              <motion.div
                key={i}
                {...enter(0.1 + i * 0.45)}
                className={`${i === 0 ? 'hidden sm:flex' : 'flex'} ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs sm:text-[13px] leading-snug ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100">
          <span className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400">
            {c.inputPlaceholder}
          </span>
          <span className="w-8 h-8 rounded-xl bg-blue-600 text-white grid place-items-center">
            <FiSend size={13} />
          </span>
        </div>
      </div>

      <div className="hidden md:flex min-h-0 flex-col gap-3 p-5 bg-white">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{c.statsTitle}</div>
        {c.stats.map((s, i) => (
          <motion.div key={s.label} {...enter(0.2 + i * 0.08)} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-500">{s.label}</span>
            <span className="text-lg font-bold text-slate-900">{s.value}</span>
          </motion.div>
        ))}
        <div className="mt-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{c.sourcesTitle}</div>
          <div className="flex flex-wrap gap-1.5">
            {c.sources.map((src) => (
              <span key={src} className="flex items-center gap-1 px-2 py-1 rounded-md bg-violet-50 text-violet-700 text-[11px] font-medium">
                <FiFileText size={11} />
                {src}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Automation */

const STEP_ICONS = [FiShoppingCart, FiFileText, FiMail, FiPackage, FiBell];

function AutomationScene({ c }) {
  return (
    <div className="h-full flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 lg:p-7 bg-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 shrink-0 rounded-xl bg-amber-100 text-amber-600 grid place-items-center">
            <FiZap size={16} />
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900 truncate">{c.flowName}</span>
          <span className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {c.status}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          {[[c.runsLabel, c.runsValue], [c.savedLabel, c.savedValue]].map(([label, value]) => (
            <div key={label} className="text-right">
              <div className="text-[11px] font-medium text-slate-500">{label}</div>
              <div className="text-base font-bold text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-stretch">
        {c.steps.map((step, i) => {
          const Icon = STEP_ICONS[i] || FiZap;
          return (
            <div key={step.title} className="contents">
              {i > 0 && (
                <div className="relative w-2 sm:w-6 lg:w-10 shrink-0 self-center h-0.5 bg-slate-200 overflow-hidden">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1, transition: { delay: i * 0.35, duration: 0.3 } }}
                    style={{ transformOrigin: 'left' }}
                    className="absolute inset-0 bg-blue-500"
                  />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0.35, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.35, duration: 0.35 } }}
                className="relative flex-1 min-w-0 flex flex-col items-center sm:items-start gap-2 p-2.5 sm:p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm"
              >
                <span className={`w-8 h-8 rounded-lg grid place-items-center ${i === 0 ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Icon size={15} />
                </span>
                <div className="hidden sm:block min-w-0 w-full">
                  <div className="text-[13px] font-semibold text-slate-900 truncate">{step.title}</div>
                  <div className="text-[11px] text-slate-500 truncate">{step.detail}</div>
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { delay: 0.35 + i * 0.35, type: 'spring', stiffness: 400, damping: 18 } }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white grid place-items-center"
                >
                  <FiCheck size={10} strokeWidth={3} />
                </motion.span>
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden p-4 rounded-xl bg-white border border-slate-200">
        <div className="text-sm font-semibold text-slate-900 mb-3">{c.logTitle}</div>
        <div className="flex flex-col gap-2.5">
          {c.logs.map((log, i) => (
            <motion.div key={log.time} {...enter(1.8 + i * 0.12)} className="flex items-center gap-3 text-xs">
              <span className="font-mono text-slate-400">{log.time}</span>
              <FiCheckCircle size={13} className="shrink-0 text-emerald-500" />
              <span className="min-w-0 truncate text-slate-700">{log.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ QR menu */

// Deterministic fake QR code: three finder squares + pseudo-random modules.
const QR_SIZE = 21;
const QR_CELLS = (() => {
  const cells = [];
  const inFinder = (x, y) =>
    [[0, 0], [QR_SIZE - 7, 0], [0, QR_SIZE - 7]].find(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      const f = inFinder(x, y);
      let on;
      if (f) {
        const dx = x - f[0];
        const dy = y - f[1];
        on = dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
      } else {
        on = ((x * 7 + y * 13 + x * y * 3) % 5) < 2;
      }
      if (on) cells.push([x, y]);
    }
  }
  return cells;
})();

function MenuScene({ c }) {
  return (
    <div className="h-full flex items-stretch justify-center gap-6 lg:gap-10 px-4 sm:px-8 py-5 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Phone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.45 } }}
        className="w-52 sm:w-56 shrink-0 rounded-[2rem] border-[6px] border-slate-900 bg-white shadow-xl overflow-hidden flex flex-col"
      >
        <div className="px-4 pt-3 pb-2.5 bg-amber-900 text-amber-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{c.brand}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50/15 text-[10px] font-semibold">{c.table}</span>
          </div>
        </div>
        <div className="flex gap-1.5 px-3 py-2.5 border-b border-slate-100">
          {c.categories.map((cat, i) => (
            <span
              key={cat}
              className={`px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                i === 0 ? 'bg-amber-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-2 px-3 py-2.5">
          {c.items.map((item, i) => (
            <motion.div
              key={item.name}
              {...enter(0.15 + i * 0.08)}
              className={`${i === 3 ? 'hidden sm:flex' : 'flex'} items-center gap-2.5`}
            >
              <span className={`w-9 h-9 shrink-0 rounded-lg ${DISH_TILES[i % DISH_TILES.length].replace('row-span-2 ', '')}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900 truncate">{item.name}</span>
                  {item.tag && (
                    <span className="px-1.5 rounded bg-rose-100 text-rose-600 text-[9px] font-bold">{item.tag}</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
              </div>
              <span className="text-[11px] font-bold text-amber-800">{item.price}</span>
            </motion.div>
          ))}
        </div>
        <div className="p-2.5 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500 text-white text-[11px] font-semibold">
            <FiBell size={11} />
            {c.callWaiter}
          </div>
        </div>
      </motion.div>

      {/* QR card */}
      <motion.div
        {...enter(0.25)}
        className="hidden sm:flex self-center flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-amber-100 shadow-sm text-center w-52"
      >
        <svg viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} className="w-32 h-32" shapeRendering="crispEdges">
          {QR_CELLS.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0f172a" />
          ))}
        </svg>
        <div>
          <div className="text-sm font-bold text-slate-900 leading-snug">{c.qrTitle}</div>
          <div className="text-xs text-slate-500 mt-1">{c.qrText}</div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">{c.table}</span>
      </motion.div>

      {/* Features */}
      <div className="hidden lg:flex self-center flex-col gap-2.5 w-64">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">{c.featuresTitle}</div>
        {c.features.map((f, i) => (
          <motion.div key={f} {...enter(0.35 + i * 0.08)} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-amber-100 text-xs font-medium text-slate-700">
            <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
              <FiCheck size={11} strokeWidth={3} />
            </span>
            {f}
          </motion.div>
        ))}
        <motion.div {...enter(0.75)} className="flex items-center justify-between mt-1 px-3.5 py-3 rounded-xl bg-amber-900 text-white">
          <span className="text-xs font-medium text-amber-100">{c.statLabel}</span>
          <span className="text-lg font-bold">{c.statValue}</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Personal site */

const GALLERY_TILES = [
  'bg-gradient-to-br from-rose-200 via-pink-200 to-amber-100',
  'bg-gradient-to-br from-slate-300 to-slate-500',
  'bg-gradient-to-br from-sky-200 to-indigo-300',
  'bg-gradient-to-br from-emerald-200 to-lime-200',
];

function PersonalScene({ c }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5 border-b border-slate-100">
        <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">{c.name}</span>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
          {c.nav.map((item) => <span key={item}>{item}</span>)}
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {c.available}
        </span>
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-[1fr_1.05fr] gap-8 lg:gap-12 px-5 sm:px-8 lg:px-12 py-6 items-center">
        <div className="min-w-0">
          <motion.div {...enter(0.05)} className="flex items-center gap-3 mb-4">
            <span className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-rose-400 text-white grid place-items-center text-lg font-bold ring-4 ring-violet-100">
              {initials(c.name)}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-violet-700">{c.role}</span>
          </motion.div>
          <motion.p {...enter(0.12)} className="text-lg sm:text-xl lg:text-2xl font-bold leading-snug tracking-tight text-slate-900 mb-5 max-w-md">
            {c.bio}
          </motion.p>
          <motion.div {...enter(0.2)} className="flex flex-wrap gap-2.5 mb-6">
            <span className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold">{c.primary}</span>
            <span className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold">{c.secondary}</span>
          </motion.div>
          <motion.div {...enter(0.28)} className="flex gap-6 sm:gap-8">
            {c.stats.map((s) => (
              <div key={s.label}>
                <div className="text-lg sm:text-xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-[11px] text-slate-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hidden md:block relative h-full max-h-72">
          <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
            {c.gallery.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 + i * 0.08, duration: 0.45 } }}
                className={`relative rounded-2xl overflow-hidden ${GALLERY_TILES[i]} ${i === 0 ? 'col-span-2' : ''} ${i === 3 ? 'col-span-2' : ''}`}
              >
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/85 text-[10px] font-semibold text-slate-700">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.div
            {...enter(0.6)}
            className="absolute -bottom-3 -left-5 max-w-[16rem] p-3.5 rounded-xl bg-white border border-slate-200 shadow-lg"
          >
            <div className="flex gap-0.5 mb-1.5 text-amber-500">
              {[0, 1, 2, 3, 4].map((n) => <FiStar key={n} size={11} className="fill-amber-500" />)}
            </div>
            <div className="text-xs text-slate-700 leading-snug">{c.testimonial}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1.5">— {c.testimonialAuthor}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Online store */

const PRODUCT_TILES = [
  'bg-gradient-to-br from-stone-200 to-amber-200',
  'bg-gradient-to-br from-sky-100 to-cyan-200',
  'bg-gradient-to-br from-rose-100 to-orange-200',
  'bg-gradient-to-br from-emerald-100 to-teal-200',
];

function StoreScene({ c }) {
  return (
    <div className="relative h-full flex flex-col bg-white">
      <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-3.5 border-b border-slate-100">
        <span className="text-sm sm:text-base font-extrabold tracking-tight text-stone-800">{c.brand}</span>
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-500">
          {c.nav.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-2 w-44 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-400">
            <FiSearch size={12} />
            {c.search}
          </span>
          <span className="relative w-9 h-9 rounded-lg bg-stone-800 text-white grid place-items-center">
            <FiShoppingCart size={15} />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold grid place-items-center">
              {c.cartCount}
            </span>
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-4 px-5 sm:px-8 py-5">
        {/* Trust chips sit next to the title; the right side is left free for the order toast. */}
        <div className="flex items-center gap-4">
          <span className="text-base sm:text-lg font-bold text-slate-900">{c.sectionTitle}</span>
          <div className="hidden md:flex gap-2">
            {c.trust.map((t) => (
              <span key={t} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                <FiCheck size={11} strokeWidth={3} />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {c.products.map((p, i) => (
            <motion.div
              key={p.name}
              {...enter(0.08 + i * 0.08)}
              className={`${i > 1 ? 'hidden md:flex' : 'flex'} min-h-0 flex-col rounded-xl border border-slate-200 overflow-hidden`}
            >
              <div className={`relative flex-1 min-h-0 ${PRODUCT_TILES[i]}`}>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-16 rounded-b-3xl rounded-t-lg bg-white/60 ring-4 ring-white/30" />
                {p.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-rose-600">{p.tag}</span>
                )}
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-slate-800 truncate">{p.name}</div>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span className="text-sm font-bold text-slate-900">{p.price}</span>
                  <span className="hidden sm:inline px-2 py-1 rounded-md bg-stone-800 text-white text-[10px] font-semibold">{c.addToCart}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 1.1, duration: 0.4, ease: 'easeOut' } }}
        className="absolute top-16 right-4 sm:right-8 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-xl"
      >
        <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">
          <FiCheckCircle size={15} />
        </span>
        <div>
          <div className="text-xs font-bold text-slate-900">{c.toastTitle}</div>
          <div className="text-[11px] text-slate-500">{c.toastText}</div>
        </div>
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------------- Booking */

const BOOKING_SELECTED_DAY = 2;
const BOOKING_SELECTED_SLOT = 3;
const BOOKING_TAKEN_SLOTS = [1, 4, 6];

function BookingScene({ c }) {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-pink-500 text-white grid place-items-center text-xs font-extrabold">
            {initials(c.brand)}
          </span>
          <span className="text-sm font-bold text-slate-900">{c.brand}</span>
        </div>
        <span className="text-xs font-semibold text-pink-600">{c.stepTitle}</span>
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-[1fr_1.35fr] lg:grid-cols-[1fr_1.35fr_1fr] gap-4 p-4 sm:p-5">
        {/* Services */}
        <div className="hidden md:flex min-h-0 flex-col gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{c.servicesTitle}</div>
          {c.services.map((s, i) => (
            <motion.div
              key={s.name}
              {...enter(0.05 + i * 0.07)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border ${
                i === 0 ? 'bg-pink-50 border-pink-300' : 'bg-white border-slate-200'
              }`}
            >
              <span className={`w-4 h-4 shrink-0 rounded-full border-2 ${i === 0 ? 'border-pink-500 bg-pink-500 ring-2 ring-inset ring-white' : 'border-slate-300'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">{s.name}</div>
                <div className="text-[11px] text-slate-500">{s.meta}</div>
              </div>
              <span className="text-xs font-bold text-slate-900">{s.price}</span>
            </motion.div>
          ))}
        </div>

        {/* Date & slots */}
        <div className="min-h-0 flex flex-col gap-3 p-4 rounded-xl bg-white border border-slate-200">
          <div className="text-sm font-semibold text-slate-900">{c.dateTitle}</div>
          <div className="grid grid-cols-7 gap-1.5">
            {c.days.map((d, i) => {
              const selected = i === BOOKING_SELECTED_DAY;
              return (
                <span
                  key={d}
                  className={`flex flex-col items-center py-1.5 rounded-lg text-[10px] font-medium ${
                    selected ? 'bg-pink-500 text-white' : i === 6 ? 'text-slate-300' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {d}
                  <span className="text-sm font-bold">{12 + i}</span>
                </span>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {c.slots.map((slot, i) => {
              const taken = BOOKING_TAKEN_SLOTS.includes(i);
              const selected = i === BOOKING_SELECTED_SLOT;
              return (
                <motion.span
                  key={slot}
                  {...enter(0.15 + i * 0.04)}
                  className={`py-2 rounded-lg text-center text-[11px] font-semibold border ${
                    selected
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : taken
                        ? 'bg-slate-50 border-slate-100 text-slate-300 line-through'
                        : 'bg-white border-slate-200 text-slate-700'
                  }`}
                  title={taken ? c.takenLabel : undefined}
                >
                  {slot}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <motion.div {...enter(0.35)} className="hidden lg:flex min-h-0 flex-col p-4 rounded-xl bg-white border border-slate-200">
          <div className="text-sm font-semibold text-slate-900 mb-3">{c.summaryTitle}</div>
          <div className="flex flex-col gap-2.5">
            {c.summary.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-semibold text-slate-900 text-right">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4">
            <div className="py-2.5 rounded-xl bg-pink-500 text-white text-center text-xs font-semibold">{c.confirm}</div>
            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-slate-500">
              <FiMessageSquare size={11} />
              {c.reminder}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- Frame */

const SCENES = {
  website: WebsiteScene,
  menu: MenuScene,
  personal: PersonalScene,
  store: StoreScene,
  booking: BookingScene,
  dashboard: DashboardScene,
  ai: AiScene,
  automation: AutomationScene,
};

export default function WorkWithMeMockup({ showcase }) {
  const Scene = SCENES[showcase.id];

  return (
    <div className="relative w-full" aria-hidden="true">
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 min-w-0 flex justify-center">
            <div className="flex items-center gap-2 min-w-0 w-full max-w-sm px-3 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-500 font-mono">
              <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span className="truncate">{showcase.url}</span>
            </div>
          </div>
          <span className="hidden sm:block w-[42px]" />
        </div>

        {/* Scene — fixed height keeps the frame landscape and stops layout jumps */}
        <div className="relative h-[22rem] sm:h-[24rem] lg:h-[26rem] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={showcase.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {Scene && <Scene c={showcase.content} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
