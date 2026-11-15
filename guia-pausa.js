const SECONDS = 45;
const DURATION = SECONDS * 1000;
const LAP = 9000;
const RISE = 4000;
const MOON_X = 320;
const MOON_Y = 160;
const LANDING_RADIUS = 100;
const CUES = {
  rise: ["Inhala suave", "Acompaña al cohete mientras despega y sube."],
  fall: ["Exhala suave", "Suelta el aire mientras el cohete desciende y aterriza."]
};

export function makeOrbitalBreak(panel) {
  const clock = panel.querySelector("#break-clock");
  const progress = panel.querySelector("#break-progress");
  const toggle = panel.querySelector("#break-toggle");
  const end = panel.querySelector("#break-end");
  const title = panel.querySelector("#break-cue-title");
  const hint = panel.querySelector("#break-cue-text");
  const windowStatus = panel.querySelector("#break-window-status");
  const ship = panel.querySelector("#break-ship");
  const thrust = panel.querySelector("#break-thrust");
  const landingPosition = ship.getAttribute("transform");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let state = "ready";
  let remaining = DURATION;
  let deadline = 0;
  let frame;

  function setCue(heading, text) {
    title.textContent = heading;
    hint.textContent = text;
  }

  function updateClock() {
    const seconds = Math.ceil(remaining / 1000);
    const formatted = "00:" + String(seconds).padStart(2, "0");
    if (clock.textContent !== formatted) {
      clock.textContent = formatted;
      clock.dateTime = "PT" + seconds + "S";
      progress.value = SECONDS - seconds;
    }
  }

  function updateOrbit() {
    const elapsed = (DURATION - remaining) % LAP;
    if (reducedMotion.matches || elapsed === 0) {
      ship.setAttribute("transform", landingPosition);
      thrust.setAttribute("opacity", "0");
      return;
    }

    const rising = elapsed < RISE;
    const fraction = rising ? elapsed / RISE : (elapsed - RISE) / (LAP - RISE);
    const eased = (1 - Math.cos(Math.PI * fraction)) / 2;
    const lapProgress = (eased + (rising ? 0 : 1)) / 2;
    const arc = Math.PI * (0.5 + 2 * lapProgress);
    const glide = Math.sin(Math.PI * lapProgress);
    const radius = LANDING_RADIUS + 15 * glide ** 2;
    const x = MOON_X + radius * Math.cos(arc);
    const y = MOON_Y + radius * Math.sin(arc);
    const angle = arc * 180 / Math.PI + 90 * glide;
    ship.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + angle + ")");
    thrust.setAttribute("opacity", String(0.7 * glide ** 2));
  }

  function showBreath(phase) {
    if (panel.dataset.breath === phase) return;
    panel.dataset.breath = phase;
    windowStatus.textContent = phase === "rise" ? "Inhala" : "Exhala";
    setCue(...CUES[phase]);
  }

  function updateActions() {
    toggle.textContent = {
      ready: "Iniciar pausa",
      running: "Pausar",
      paused: "Continuar",
      done: "Repetir pausa"
    }[state];
    end.hidden = state !== "running" && state !== "paused";
    clock.hidden = state === "done" && remaining > 0;
  }

  function finish(completed) {
    const focusEnd = document.activeElement === end;
    cancelAnimationFrame(frame);
    state = "done";
    if (completed) remaining = 0;
    updateClock();
    updateOrbit();
    updateActions();
    delete panel.dataset.breath;
    windowStatus.textContent = "Pausa finalizada";
    setCue("Pausa finalizada", "Retoma tu tarea cuando estés listo.");
    if (focusEnd) toggle.focus({ preventScroll: true });
  }

  function tick(now) {
    remaining = Math.max(0, deadline - now);
    if (!remaining) {
      finish(true);
      return;
    }
    updateClock();
    updateOrbit();
    showBreath((DURATION - remaining) % LAP < RISE ? "rise" : "fall");
  }

  function animate(now) {
    if (state !== "running") return;
    tick(now);
    if (state === "running") frame = requestAnimationFrame(animate);
  }

  function pause() {
    if (state !== "running") return;
    tick(performance.now());
    if (state !== "running") return;
    cancelAnimationFrame(frame);
    state = "paused";
    updateActions();
    delete panel.dataset.breath;
    windowStatus.textContent = "Pausa en espera";
    setCue("Pausa en espera", "Puedes seguir con tu respiración habitual hasta que quieras continuar.");
  }

  toggle.addEventListener("click", () => {
    if (state === "running") {
      pause();
      return;
    }
    if (state !== "paused") remaining = DURATION;
    state = "running";
    const now = performance.now();
    deadline = now + remaining;
    updateActions();
    animate(now);
  });

  end.addEventListener("click", () => {
    if (state === "running") tick(performance.now());
    if (state !== "done") finish(false);
  });

  reducedMotion.addEventListener("change", updateOrbit);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
  window.addEventListener("pagehide", pause);
  return pause;
}
