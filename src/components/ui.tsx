import type { ReactNode } from 'react'
import { Arrow } from '../visuals'

export function Label({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label">
    <span className="label-number">{number}</span>
    <span>{children}</span>
  </div>
}

export function External({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <External href={href} className="source-link">{children}<Arrow diagonal />
  </External>
}
