export default function Toast({ message }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(31,41,55,0.92)',
        color: '#fff',
        fontSize: 14,
        fontWeight: 500,
        padding: '11px 20px',
        borderRadius: 14,
        whiteSpace: 'nowrap',
        zIndex: 200,
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(8px)',
        animation: 'toastIn 0.2s ease',
        pointerEvents: 'none',
      }}
    >
      {message}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
