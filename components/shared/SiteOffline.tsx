import type { FC } from 'react'

interface SiteOfflineProps {
  status: 'disabled' | 'archived'
  reason?: string | null
  brandName?: string | null
}

/**
 * Public-facing page shown when a site's `site_status` is not `active`.
 * Keeps messaging simple and professional — no heavy design fluff.
 */
const SiteOffline: FC<SiteOfflineProps> = ({ status, reason, brandName }) => {
  const isArchived = status === 'archived'
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#f9f9f8',
        color: '#1a1a1a',
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Simple icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: isArchived ? '#f3f4f6' : '#fef9c3',
            border: `1px solid ${isArchived ? '#e5e7eb' : '#fde68a'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.5rem',
          }}
        >
          {isArchived ? '🗂️' : '🔒'}
        </div>

        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            margin: '0 0 0.5rem',
            letterSpacing: '-0.01em',
          }}
        >
          {brandName ? `${brandName} is` : 'This website is'}{' '}
          {isArchived ? 'no longer available' : 'temporarily offline'}
        </h1>

        <p
          style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            lineHeight: 1.6,
            margin: '0 0 1.5rem',
          }}
        >
          {isArchived
            ? 'This website has been archived and is not accepting visitors.'
            : 'The owner has temporarily taken this website offline. Please check back later.'}
        </p>

        {reason && (
          <p
            style={{
              fontSize: '0.8rem',
              color: '#9ca3af',
              fontStyle: 'italic',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1rem',
              marginTop: '0',
            }}
          >
            {reason}
          </p>
        )}
      </div>
    </div>
  )
}

export default SiteOffline
