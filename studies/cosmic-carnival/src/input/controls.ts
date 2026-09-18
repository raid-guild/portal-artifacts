interface ControlCallbacks {
  move: (direction: number) => void;
  fire: () => void;
  start: () => void;
  pause: () => void;
  mute: () => void;
}

export class Controls {
  private heldDirection = 0;
  private heldFire = false;
  private repeatTimer = 0;
  private wheelAccumulator = 0;
  private enabled = true;
  private readonly callbacks: ControlCallbacks;
  private readonly canvas: HTMLCanvasElement;
  private readonly touchButtons: NodeListOf<HTMLButtonElement>;

  constructor(canvas: HTMLCanvasElement, callbacks: ControlCallbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.touchButtons = document.querySelectorAll<HTMLButtonElement>("[data-touch]");
    this.bind();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.clearHeld();
  }

  update(dt: number): void {
    if (!this.enabled) return;
    if (this.heldFire) this.callbacks.fire();
    if (this.heldDirection === 0) return;
    this.repeatTimer -= dt;
    if (this.repeatTimer <= 0) {
      this.callbacks.move(this.heldDirection);
      this.repeatTimer = 0.105;
    }
  }

  clearHeld(): void {
    this.heldDirection = 0;
    this.heldFire = false;
    this.repeatTimer = 0;
    this.wheelAccumulator = 0;
  }

  private bind(): void {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "a", "d", " ", "enter", "escape", "m"].includes(key)) event.preventDefault();
      if (event.repeat && ![" "].includes(key)) return;
      if (key === "enter") this.callbacks.start();
      if (key === "escape") this.callbacks.pause();
      if (key === "m") this.callbacks.mute();
      if (!this.enabled) return;
      if (key === "arrowleft" || key === "a") this.pressDirection(-1);
      if (key === "arrowright" || key === "d") this.pressDirection(1);
      if (key === " ") {
        this.heldFire = true;
        this.callbacks.fire();
      }
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if ((key === "arrowleft" || key === "a") && this.heldDirection < 0) this.heldDirection = 0;
      if ((key === "arrowright" || key === "d") && this.heldDirection > 0) this.heldDirection = 0;
      if (key === " ") this.heldFire = false;
    });

    this.canvas.addEventListener("pointerdown", () => this.canvas.focus());
    this.canvas.addEventListener("wheel", (event) => {
      if (!this.enabled || document.activeElement !== this.canvas) return;
      event.preventDefault();
      const normalized = Math.max(-80, Math.min(80, event.deltaY));
      this.wheelAccumulator += normalized;
      while (Math.abs(this.wheelAccumulator) >= 42) {
        const direction = this.wheelAccumulator > 0 ? 1 : -1;
        this.callbacks.move(direction);
        this.wheelAccumulator -= direction * 42;
      }
    }, { passive: false });

    this.touchButtons.forEach((button) => {
      const action = button.dataset.touch;
      const press = (event: PointerEvent) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        if (!this.enabled) return;
        if (action === "left") this.pressDirection(-1);
        if (action === "right") this.pressDirection(1);
        if (action === "fire") {
          this.heldFire = true;
          this.callbacks.fire();
        }
      };
      const release = (event: PointerEvent) => {
        event.preventDefault();
        if (action === "fire") this.heldFire = false;
        if ((action === "left" && this.heldDirection < 0) || (action === "right" && this.heldDirection > 0)) this.heldDirection = 0;
      };
      button.addEventListener("pointerdown", press);
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", () => this.clearHeld());
    });

    window.addEventListener("blur", () => this.clearHeld());
  }

  private pressDirection(direction: number): void {
    if (this.heldDirection !== direction) {
      this.callbacks.move(direction);
      this.repeatTimer = 0.25;
    }
    this.heldDirection = direction;
  }
}
