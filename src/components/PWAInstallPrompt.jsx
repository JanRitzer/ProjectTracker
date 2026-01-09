import { usePWAInstall } from '../hooks/usePWAInstall';
import { useEffect, useState } from 'react';
import styles from './PWAInstallPrompt.module.css';

export function PWAInstallPrompt() {
  const { isInstallable, promptInstall, dismissPrompt } = usePWAInstall();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isInstallable) return;

    // Check if user dismissed recently (within 7 days)
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 7) {
        return;
      }
    }

    // Show after 30 seconds of usage
    const timer = setTimeout(() => {
      setShow(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setShow(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className={styles.container}>
      <div className={styles.prompt}>
        <div className={styles.content}>
          <div className={styles.icon}>📱</div>
          <div className={styles.text}>
            <h3>Install Project Tracker</h3>
            <p>Get quick access and work offline</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={handleInstall} className={styles.installBtn}>
            Install
          </button>
          <button onClick={handleDismiss} className={styles.dismissBtn}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
