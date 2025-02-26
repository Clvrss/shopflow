export function formatCents(cents) {
  if (cents === null || cents === undefined) return '$0.00';
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Price({ cents, className = '' }) {
  return <span className={`price${className ? ` ${className}` : ''}`}>{formatCents(cents)}</span>;
}
