import type { Action, Reply, State } from './game';
import { beacons, destinations, GUILD_ROUTE } from './transit';
import { routeSymbol } from './route-art';

export const crossingDialogs = `
<dialog id="route-dialog" class="route-dialog" aria-labelledby="route-title">
  <header class="route-header"><div><p class="eyebrow">THE CROSSING · ROUTE BOOK</p><h2 id="route-title">First the place.<br>Then its light.</h2></div><button id="close-route" class="route-close" aria-label="Close route book">×</button></header>
  <div class="route-spread">
    <section class="notebook-page" aria-label="Notebook route sketch">
      <p class="page-number">FROM YOUR NOTEBOOK / 07</p><h3>A way to the Guild</h3>
      <div id="route-clue" hidden><p class="notebook-note">A route copied at the last town.<br>Someone has underlined “welcome.”</p>
        <div class="sketched-address"><div>${routeSymbol(destinations[GUILD_ROUTE.destination])}<span>${destinations[GUILD_ROUTE.destination]}</span><small>the place</small></div><span class="route-arrow">→</span><div>${routeSymbol(beacons[GUILD_ROUTE.beacon])}<span>${beacons[GUILD_ROUTE.beacon]}</span><small>the beacon</small></div></div>
        <p class="handwritten">“First the place. Then the light<br>that welcomes you.”</p><p class="notebook-footer">Below the map: a walking lantern, still falling over on every left turn.</p>
      </div><div id="closed-clue"><p>Your route sketch is tucked between a few unfinished inventions.</p><button id="read-route" class="ink-button">Open notebook</button></div>
    </section>
    <section class="route-machine" aria-label="Transit controls"><p class="eyebrow">BRASS ROUTE SELECTOR</p><p class="machine-instruction">Turn each ring to choose a symbol.</p>
      <div class="route-rings">${(['destination', 'beacon'] as const).map((ring, index) => `<div class="ring-station"><span class="ring-caption">${index + 1} / ${index === 0 ? 'PLACE' : 'BEACON'}</span><button class="route-ring" id="ring-${ring}" data-ring="${ring}" aria-label="Turn ${ring} ring"><span id="symbol-${ring}"></span></button><strong id="label-${ring}"></strong><button class="previous-symbol" data-previous="${ring}" aria-label="Previous ${ring} symbol">← Previous</button></div>`).join('')}</div>
      <button id="transmit-route" class="signal-lever">Pull signal lever <span aria-hidden="true">↗</span></button><p id="route-feedback" class="route-feedback" role="status" aria-live="polite">The receiver waits for an address.</p>
    </section>
  </div><footer class="route-bottom"><span id="route-connection">NO CONNECTION</span><button id="return-to-landing" class="ink-button">Back to landing →</button></footer>
</dialog>`;

export class CrossingPanel {
  readonly dialog = document.querySelector<HTMLDialogElement>('#route-dialog')!;
  private clueOpen = false;
  private onlyNotebook = false;
  constructor(private getState: () => State, private act: (action: Action) => Reply, onClose: () => void) {
    this.dialog.addEventListener('close', onClose);
    this.dialog.querySelector('#close-route')!.addEventListener('click', () => this.dialog.close());
    this.dialog.querySelector('#return-to-landing')!.addEventListener('click', () => this.dialog.close());
    this.dialog.querySelector('#read-route')!.addEventListener('click', () => {
      this.act({ type: 'inspect', target: 'notebook' }); this.clueOpen = true; this.render();
      this.dialog.querySelector<HTMLButtonElement>('#ring-destination')!.focus();
    });
    this.dialog.querySelectorAll<HTMLButtonElement>('[data-ring], [data-previous]').forEach(button => button.addEventListener('click', () => {
      const ring = (button.dataset.ring ?? button.dataset.previous) as 'destination' | 'beacon';
      const reply = this.act({ type: 'turn-ring', ring, direction: button.dataset.previous ? -1 : 1 });
      this.render(); this.feedback(reply.text);
    }));
    this.dialog.querySelector('#transmit-route')!.addEventListener('click', () => {
      const reply = this.act({ type: 'transmit' }); this.render(); this.feedback(reply.text);
      if (this.getState().transit.active) this.dialog.querySelector<HTMLButtonElement>('#return-to-landing')!.focus();
    });
  }
  open(onlyNotebook = false, showClue = false) {
    this.onlyNotebook = onlyNotebook;
    this.clueOpen = onlyNotebook || showClue || this.getState().transit.notebookRead;
    this.render();
    this.feedback(this.getState().transit.active ? 'The Guild has answered. The arch is open; your company is expected.' : 'The receiver waits for an address.');
    if (!this.dialog.open) this.dialog.showModal();
  }
  close() { this.dialog.close(); }
  private feedback(text: string) { this.dialog.querySelector('#route-feedback')!.textContent = text; }
  render() {
    const t = this.getState().transit;
    this.dialog.classList.toggle('notebook-only', this.onlyNotebook);
    this.dialog.querySelector<HTMLElement>('#route-clue')!.hidden = !this.clueOpen;
    this.dialog.querySelector<HTMLElement>('#closed-clue')!.hidden = this.clueOpen;
    for (const ring of ['destination', 'beacon'] as const) {
      const name = (ring === 'destination' ? destinations : beacons)[t[ring]];
      this.dialog.querySelector(`#symbol-${ring}`)!.innerHTML = routeSymbol(name);
      this.dialog.querySelector(`#label-${ring}`)!.textContent = name;
      const button = this.dialog.querySelector<HTMLButtonElement>(`#ring-${ring}`)!;
      button.setAttribute('aria-label', `Turn ${ring} ring, currently ${name}`);
      button.disabled = t.active;
      this.dialog.querySelector<HTMLButtonElement>(`[data-previous="${ring}"]`)!.disabled = t.active;
    }
    this.dialog.querySelector<HTMLButtonElement>('#transmit-route')!.disabled = t.active;
    this.dialog.querySelector('#route-connection')!.textContent = t.active ? 'CONNECTED · RAID GUILD' : 'NO CONNECTION';
    this.dialog.classList.toggle('connected', t.active);
  }
}
