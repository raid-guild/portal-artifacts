import { archivePreview, ARCHIVE_CIPHER, ARCHIVE_PLAINTEXT } from './archive';
import type { Action, Reply, State } from './game';

export const archiveDialog = `
<dialog id="archive-dialog" class="archive-dialog" aria-labelledby="archive-title">
  <header class="archive-header"><div><p class="eyebrow">CYPHERPUNK ARCHIVE · SIGNAL 01</p><h2 id="archive-title">Turn the alphabet.<br>Read the signal.</h2></div><button id="close-archive" class="archive-close" aria-label="Close decoder">×</button></header>
  <div class="archive-spread">
    <section class="archive-record" aria-label="Encrypted archive record">
      <p class="archive-file">ARCHIVE NOTE / 1993</p><h3>Privacy is something people build.</h3>
      <p>Eric Hughes’s <cite>A Cypherpunk’s Manifesto</cite> connected privacy to working systems, not promises. Its enduring imperative was concise: <strong>“Cypherpunks write code.”</strong></p>
      <p class="archive-context">This old shift cipher is not secure. It is a hands-on reminder that ideas matter when they become usable tools.</p>
      <div class="sealed-message"><span>SEALED MESSAGE</span><code>${ARCHIVE_CIPHER}</code></div>
    </section>
    <section class="decoder-machine" aria-label="ROT decoder controls">
      <p class="eyebrow">BRASS ALPHABET RING</p><p class="machine-instruction">Turn the ring until the preview becomes a clear instruction.</p>
      <div class="decoder-controls">
        <button id="archive-previous" class="ring-step" aria-label="Turn decoder ring backward">−</button>
        <button id="archive-ring" class="archive-ring" aria-label="Turn decoder ring forward, currently ROT 00"><span class="ring-letters" aria-hidden="true">A · D · G · J · M · P · S · V · Y</span><strong id="archive-shift">ROT 00</strong><small>TURN</small></button>
        <button id="archive-next" class="ring-step" aria-label="Turn decoder ring forward">+</button>
      </div>
      <div class="archive-preview"><span>LIVE PREVIEW</span><code id="archive-preview" aria-live="polite">${ARCHIVE_CIPHER}</code></div>
      <button id="check-archive" class="signal-lever">Check the signal <span aria-hidden="true">↗</span></button>
      <p id="archive-feedback" class="archive-feedback" role="status" aria-live="polite">Every rotation is safe to try.</p>
    </section>
  </div>
  <footer class="archive-bottom"><span id="archive-status">SEALED · 26 POSSIBLE ROTATIONS</span><button id="return-to-archive" class="ink-button">Back to the room →</button></footer>
</dialog>`;

export class ArchivePanel {
  readonly dialog = document.querySelector<HTMLDialogElement>('#archive-dialog')!;
  private pointerX: number | null = null;
  private suppressClick = false;
  constructor(private getState: () => State, private act: (action: Action) => Reply, onClose: () => void) {
    this.dialog.addEventListener('close', onClose);
    this.dialog.querySelector('#close-archive')!.addEventListener('click', () => this.dialog.close());
    this.dialog.querySelector('#return-to-archive')!.addEventListener('click', () => this.dialog.close());
    this.dialog.querySelector('#archive-previous')!.addEventListener('click', () => this.turn(-1));
    this.dialog.querySelector('#archive-next')!.addEventListener('click', () => this.turn(1));
    const ring = this.dialog.querySelector<HTMLButtonElement>('#archive-ring')!;
    ring.addEventListener('click', () => {
      if (this.suppressClick) { this.suppressClick = false; return; }
      this.turn(1);
    });
    ring.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault(); this.turn(event.key === 'ArrowLeft' ? -1 : 1);
    });
    ring.addEventListener('pointerdown', event => { this.pointerX = event.clientX; });
    ring.addEventListener('pointerup', event => {
      if (this.pointerX === null || Math.abs(event.clientX - this.pointerX) < 18) { this.pointerX = null; return; }
      const direction = event.clientX > this.pointerX ? 1 : -1;
      this.pointerX = null; this.suppressClick = true; this.turn(direction);
    });
    ring.addEventListener('pointercancel', () => { this.pointerX = null; });
    this.dialog.querySelector('#check-archive')!.addEventListener('click', () => {
      const reply = this.act({ type: 'confirm-archive' }); this.render(); this.feedback(reply.text);
      if (this.getState().archive.solved) this.dialog.querySelector<HTMLButtonElement>('#return-to-archive')!.focus();
    });
  }
  open() {
    this.render();
    this.feedback(this.getState().archive.solved ? `${ARCHIVE_PLAINTEXT}. The lantern signal is open.` : 'Every rotation is safe to try.');
    if (!this.dialog.open) this.dialog.showModal();
  }
  close() { if (this.dialog.open) this.dialog.close(); }
  private turn(direction: 1 | -1) {
    const reply = this.act({ type: 'turn-archive-ring', direction }); this.render(); this.feedback(reply.text);
  }
  private feedback(text: string) { this.dialog.querySelector('#archive-feedback')!.textContent = text; }
  render() {
    const archive = this.getState().archive;
    const shift = String(archive.shift).padStart(2, '0');
    this.dialog.querySelector('#archive-shift')!.textContent = `ROT ${shift}`;
    this.dialog.querySelector('#archive-preview')!.textContent = archivePreview(archive);
    const ring = this.dialog.querySelector<HTMLButtonElement>('#archive-ring')!;
    ring.style.setProperty('--ring-turn', `${archive.shift * 13.846}deg`);
    ring.setAttribute('aria-label', `Turn decoder ring forward, currently ROT ${shift}. Use left and right arrow keys to turn either way.`);
    this.dialog.querySelector<HTMLButtonElement>('#archive-previous')!.disabled = archive.solved;
    this.dialog.querySelector<HTMLButtonElement>('#archive-next')!.disabled = archive.solved;
    ring.disabled = archive.solved;
    this.dialog.querySelector<HTMLButtonElement>('#check-archive')!.disabled = archive.solved;
    this.dialog.querySelector('#archive-status')!.textContent = archive.solved ? `OPEN · ${ARCHIVE_PLAINTEXT}` : `SEALED · ROT ${shift}`;
    this.dialog.classList.toggle('solved', archive.solved);
  }
}
