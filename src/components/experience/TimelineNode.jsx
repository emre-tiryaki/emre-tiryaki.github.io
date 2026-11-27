/** Zaman çizelgesi düğümü: parlayan, iç içe "mücevher" daire. Tek kaynak (ExperiencePage + guestbook). */
export default function TimelineNode({ color, selected = false, style }) {
  return (
    <div
      style={{
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(26,26,32,0.98) 0%, rgba(10,10,14,0.98) 100%)',
        border: selected ? `2px solid ${color}` : `1.5px solid ${color}`,
        boxShadow: selected
          ? `0 0 22px ${color}, 0 0 8px ${color}, inset 0 0 10px ${color}`
          : `0 0 14px ${color}55, 0 0 6px ${color}80, inset 0 0 8px ${color}25`,
        position: 'relative',
        zIndex: 3,
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      <div
        style={{
          width: '1.15rem',
          height: '1.15rem',
          borderRadius: '50%',
          background: `${color}18`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '0.45rem',
            height: '0.45rem',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}
