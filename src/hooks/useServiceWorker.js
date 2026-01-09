import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function useServiceWorker() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefreshState, setNeedRefreshState],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('Service Worker registered:', registration);
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    },
  });

  useEffect(() => {
    if (needRefreshState) {
      setNeedRefresh(true);
      setUpdateAvailable(true);
    }
  }, [needRefreshState]);

  const update = async () => {
    await updateServiceWorker(true);
    setNeedRefresh(false);
  };

  const close = () => {
    setOfflineReady(false);
    setNeedRefreshState(false);
  };

  return {
    offlineReady,
    needRefresh,
    updateAvailable,
    update,
    close,
  };
}
