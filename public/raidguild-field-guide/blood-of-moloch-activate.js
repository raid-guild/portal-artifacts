for (const host of document.querySelectorAll('[data-brood-can]')) {
  const explore = host.querySelector('[data-brood-explore]');
  const controls = host.querySelector('.brood-orbit-controls');
  const status = host.querySelector('.brood-model-status');
  const spread = host.closest('.book-spread');
  let viewer = null;
  let request = 0;
  const printing = matchMedia('print');
  const reset = () => {
    request++;
    viewer?.dispose();
    viewer = null;
    host.dataset.active = 'false';
    explore.hidden = false;
    explore.disabled = false;
    controls.hidden = true;
    status.textContent = '';
  };
  explore.addEventListener('click', async () => {
    const current = ++request;
    explore.disabled = true;
    status.textContent = 'Loading 3D can…';
    try {
      const { createCanViewer } = await import('./blood-of-moloch-viewer.js');
      if (current !== request) return;
      const loaded = await createCanViewer(host, host.dataset.model);
      if (current !== request) { loaded?.dispose(); return; }
      if (!loaded) throw new Error('3D view was closed');
      viewer = loaded;
      host.dataset.active = 'true';
      explore.hidden = true;
      controls.hidden = false;
      status.textContent = 'Drag to orbit · scroll to zoom';
      viewer.render();
    } catch (error) {
      if (current === request) status.textContent = '3D view unavailable. The can image is still here.';
    } finally {
      if (current === request) explore.disabled = false;
    }
  });
  host.querySelector('[data-brood-left]').addEventListener('click', () => viewer?.rotate(-1));
  host.querySelector('[data-brood-right]').addEventListener('click', () => viewer?.rotate(1));
  host.querySelector('[data-brood-reset]').addEventListener('click', () => viewer?.reset());
  host.querySelector('[data-brood-close]').addEventListener('click', reset);
  if (spread) {
    const observer = new MutationObserver(() => {
      if (spread.dataset.active !== 'true' && spread.closest('#book')?.dataset.view !== 'all') reset();
    });
    observer.observe(spread, {attributes:true, attributeFilter:['data-active']});
  }
  printing.addEventListener('change', () => { if (printing.matches) reset(); });
}
