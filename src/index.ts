  const TAB_TIMEOUT = 10800000; // 3 hours
  const LOG_PREFIX = `Tampermonkey Tab Suspender: `;
  const renderSuspendedElement = () =>
    `<h1>Tab suspended. Click or press enter to restore the tab.</h1>`;

  console.log(`${LOG_PREFIX}script running`);

  function bootstrapRestore() {
    const LOG_PREFIX = `Tampermonkey Tab Suspender: `;

    function restoreTab() {
      console.log(`${LOG_PREFIX}restore previous tab`);
      // window.history.back();
      window.location.reload();
    }
    console.log(`${LOG_PREFIX}Tab suspended!`);
    window.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        restoreTab();
      }
    });
    window.addEventListener('click', restoreTab);
  }

  function suspendTab() {
    console.log(`${LOG_PREFIX}Suspend Tab!`);
    window.location.href = 'about:blank';
    document.write(
      `${renderSuspendedElement()}<script>${bootstrapRestore.toString()} bootstrapRestore();</script>`,
    );
  }

  let timeout: null | number = null;
  window.addEventListener('visibilitychange', () => {
    if (document.hidden && navigator.mediaSession?.playbackState !== 'playing') {
      timeout = setTimeout(suspendTab, TAB_TIMEOUT);
    } else if (timeout !== null) {
      clearTimeout(timeout);
    }
  });
