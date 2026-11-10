(() => {
  const t = (typeof I18n !== 'undefined' && I18n.t) || ((s) => s);
  const status = document.getElementById('offlineStatus'),
    install = document.getElementById('installApp');
  let prompt,
    registration,
    checking = false;
  const connectivity = () => {
    status.textContent = navigator.onLine
      ? t('Reference snapshot · updates automatically when online')
      : t('Offline · using downloaded reference data. Verify current requirements before shipment.');
  };
  connectivity();
  window.addEventListener('online', connectivity);
  window.addEventListener('offline', connectivity);
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    prompt = event;
    install.hidden = false;
  });
  install.addEventListener('click', async () => {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    prompt = null;
    install.hidden = true;
  });
  window.addEventListener('appinstalled', () => {
    install.hidden = true;
    document.getElementById('installHelp').hidden = true;
  });
  if (!('serviceWorker' in navigator)) {
    document.getElementById('pwaReady').textContent = t('Offline storage is not supported in this browser.');
    return;
  }
  async function checkUpdates() {
    if (!registration || checking || !navigator.onLine || document.visibilityState === 'hidden') return;
    checking = true;
    try {
      await registration.update();
      if (!registration.installing && !registration.waiting)
        registration.active?.postMessage({ type: 'CHECK_FOR_UPDATES' });
    } catch {
      /* Retry on the next online/resume/interval event. */
    } finally {
      checking = false;
    }
  }
  window.addEventListener('online', checkUpdates);
  window.addEventListener('focus', checkUpdates);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkUpdates();
  });
  setInterval(checkUpdates, 5 * 60 * 1000);
  navigator.serviceWorker
    .register(new URL('sw.js', location.href), { updateViaCache: 'none' })
    .then(async (reg) => {
      registration = reg;
      await navigator.serviceWorker.ready;
      document.getElementById('pwaReady').textContent = t(
        'Offline reference ready · app updates install automatically.'
      );
      checkUpdates();
    })
    .catch(() => {
      document.getElementById('pwaReady').textContent = t(
        'Offline storage unavailable. You can continue online; reload to retry.'
      );
    });
})();
