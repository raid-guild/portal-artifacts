(() => {
  "use strict";

  const names = {
    stamp: "Stamp wipe",
    ink: "Stamp to ink",
    split: "Blade split",
    fade: "Fade through",
  };

  const root = document.documentElement;
  const body = document.body;
  const layer = document.querySelector("[data-transition-layer]");
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const destinations = [...document.querySelectorAll("[data-destination]")];
  const recipeInputs = [...document.querySelectorAll('input[name="recipe"]')];
  const durationInput = document.querySelector("#duration");
  const durationOutput = document.querySelector("#duration-output");
  const easingInput = document.querySelector("#easing");
  const status = document.querySelector("#motion-status");
  const replayButton = document.querySelector("[data-replay]");
  const dialog = document.querySelector(".field-dialog");
  const modalOpeners = [...document.querySelectorAll("[data-open-modal]")];
  const modalClosers = [...document.querySelectorAll("[data-close-modal]")];
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  let activeScene = "threshold";
  let recipe = "stamp";
  let duration = 1100;
  let running = false;
  let lastTrigger = null;
  let transitionTimer = 0;

  const reducedDuration = () => (motionQuery.matches ? 120 : duration);
  const midpoint = () => Math.round(reducedDuration() * 0.48);

  function updateReadout(message = "Ready") {
    const reduction = motionQuery.matches ? " · reduced motion" : "";
    status.textContent = `${message} · ${names[recipe]} · ${duration} ms${reduction}`;
  }

  function setControlsDisabled(disabled) {
    destinations.forEach((button) => { button.disabled = disabled; });
    modalOpeners.forEach((button) => { button.disabled = disabled; });
    recipeInputs.forEach((input) => { input.disabled = disabled; });
    durationInput.disabled = disabled;
    easingInput.disabled = disabled;
    replayButton.disabled = disabled;
  }

  function activateScene(nextScene) {
    activeScene = nextScene;
    const activeIndex = scenes.findIndex((scene) => scene.dataset.scene === nextScene);

    scenes.forEach((scene) => {
      const selected = scene.dataset.scene === nextScene;
      scene.classList.toggle("is-active", selected);
      scene.setAttribute("aria-hidden", String(!selected));
      scene.querySelectorAll("button, a").forEach((control) => {
        control.tabIndex = selected ? 0 : -1;
      });
    });

    destinations.forEach((button) => {
      const selected = button.dataset.destination === nextScene;
      button.classList.toggle("is-current", selected);
      if (selected) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    document.querySelector(".index-number").textContent = String(activeIndex + 1).padStart(2, "0");
    document.querySelector(".index-line").style.setProperty("--progress", (activeIndex + 1) / scenes.length);
  }

  function runTransition({ label = "Transitioning", reverse = false, atMidpoint, onComplete } = {}) {
    if (running) return false;
    running = true;
    window.clearTimeout(transitionTimer);
    setControlsDisabled(true);
    body.classList.add("is-transitioning");
    layer.dataset.recipe = recipe;
    layer.dataset.direction = reverse ? "reverse" : "forward";
    layer.classList.remove("is-running");
    void layer.offsetWidth;
    layer.classList.add("is-running");
    updateReadout(label);

    window.setTimeout(() => { if (running) atMidpoint?.(); }, midpoint());
    transitionTimer = window.setTimeout(() => {
      layer.classList.remove("is-running");
      body.classList.remove("is-transitioning");
      setControlsDisabled(false);
      running = false;
      updateReadout("Ready");
      onComplete?.();
    }, reducedDuration() + 40);
    return true;
  }

  destinations.forEach((button) => {
    button.addEventListener("click", () => {
      const nextScene = button.dataset.destination;
      if (!nextScene || nextScene === activeScene) {
        runTransition({ label: "Replaying" });
        return;
      }
      runTransition({
        label: `Crossing to ${button.textContent.trim().replace(/^\d+\s*/, "")}`,
        atMidpoint: () => activateScene(nextScene),
        onComplete: () => button.focus({ preventScroll: true }),
      });
    });
  });

  recipeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      recipe = input.value;
      document.querySelectorAll(".recipe-card").forEach((card) => {
        card.classList.toggle("is-selected", card.contains(input));
      });
      updateReadout("Ready");
    });
  });

  durationInput.addEventListener("input", () => {
    duration = Number(durationInput.value);
    durationOutput.value = `${duration} ms`;
    durationOutput.textContent = `${duration} ms`;
    root.style.setProperty("--duration", `${duration}ms`);
    updateReadout("Ready");
  });

  easingInput.addEventListener("change", () => {
    root.style.setProperty("--ease", easingInput.value);
    updateReadout("Easing updated");
  });

  replayButton.addEventListener("click", () => runTransition({ label: "Replaying" }));

  function openDialog(event) {
    if (running || dialog.open) return;
    lastTrigger = event.currentTarget;
    runTransition({
      label: "Opening field note",
      atMidpoint: () => {
        dialog.showModal();
        dialog.querySelector("[data-close-modal]").focus({ preventScroll: true });
      },
    });
  }

  function closeDialog() {
    if (running || !dialog.open) return;
    dialog.classList.add("is-closing");
    runTransition({
      label: "Returning from field note",
      reverse: true,
      atMidpoint: () => dialog.close(),
      onComplete: () => {
        dialog.classList.remove("is-closing");
        lastTrigger?.focus({ preventScroll: true });
      },
    });
  }

  modalOpeners.forEach((button) => button.addEventListener("click", openDialog));
  modalClosers.forEach((button) => button.addEventListener("click", closeDialog));
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  motionQuery.addEventListener?.("change", () => updateReadout("Preference changed"));
  activateScene(activeScene);
  updateReadout();
})();
