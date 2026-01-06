import styles from './PriorityBadge.module.css';

export function PriorityBadge({ priority }) {
  const config = {
    high: { label: 'HIGH', className: styles.high },
    medium: { label: 'MED', className: styles.medium },
    low: { label: 'LOW', className: styles.low }
  };

  const { label, className } = config[priority] || config.medium;

  return (
    <span className={`${styles.badge} ${className}`}>
      {label}
    </span>
  );
}
