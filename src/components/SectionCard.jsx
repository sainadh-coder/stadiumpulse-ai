/**
 * SectionCard provides the shared glass-panel shell used by role dashboards, keeping
 * repeated card spacing and visual treatment consistent without changing the design system.
 */
/** @typedef {{ children: import('react').ReactNode, className?: string, labelledBy?: string, live?: boolean }} SectionCardProps */

/** @param {SectionCardProps} props */
export default function SectionCard({ children, className = '', labelledBy, live = false }) {
  return (
    <section
      className={`glass rounded-3xl p-5 ${className}`}
      aria-labelledby={labelledBy}
      aria-live={live ? 'polite' : undefined}
    >
      {children}
    </section>
  )
}
