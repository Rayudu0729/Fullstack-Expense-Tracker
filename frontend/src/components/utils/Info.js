function Info({ text }) {
    return (
        <div style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: 'var(--text)',
            opacity: 0.6,
            fontFamily: "'Inter', sans-serif"
        }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
                <line x1="9" y1="14" x2="15" y2="14" opacity="0.5" />
                <line x1="9" y1="18" x2="13" y2="18" opacity="0.5" />
            </svg>
            <p style={{ fontSize: '15px', fontWeight: 500, margin: 0 }}>{text}</p>
        </div>
    )
}

export default Info;