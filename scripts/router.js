(() => {
  "use strict";
  const resources = JSON.parse(document.getElementById("vita-bundle").textContent);
  const memory = new Map();
  let file = document.getElementById("vita-frame");
  const storage = {
    getItem(key) {
      try {
        return memory.has(key) ? memory.get(key) : window.localStorage.getItem(key);
      } catch {
        return memory.get(key) ?? null;
      }
    },
    setItem(key, value) {
      memory.set(key, value);
      window.localStorage.setItem(key, value);
      memory.delete(key);
    }
  };
  const byFilename = {
    "./": "inicio",
    "index.html": "inicio",
    "guia.html": "guia",
    "sintomas.html": "sintomas",
    "nutricion.html": "nutricion",
    "mision.html": "mision"
  };
  let current;

  function fromHash() {
    const [page, target = ""] = location.hash.slice(1).split("/");
    return Object.hasOwn(resources.pages, page) ? { page, target } : { page: "inicio", target: "" };
  }

  function key(route) {
    return "#" + route.page + (route.target ? "/" + encodeURIComponent(route.target) : "");
  }

  function resolve(href, page) {
    if (!href) return null;
    const [path, target = ""] = href.split("#", 2);
    if (!path && href.startsWith("#")) return { page, target };
    if (!Object.hasOwn(byFilename, path)) return null;
    return { page: byFilename[path], target };
  }

  function scrollToTarget(frameWindow, target, focus) {
    if (!target) {
      frameWindow.scrollTo(0, 0);
      return;
    }
    const anchor = frameWindow.document.getElementById(target);
    if (!anchor) return;
    anchor.scrollIntoView();
    if (focus && anchor.tagName === "MAIN") {
      anchor.tabIndex = -1;
      anchor.focus({ preventScroll: true });
    }
  }

  function createScreen(page, target) {
    let hash = target ? "#" + target : "";
    let frameWindow;
    return {
      get hash() { return hash; },
      go(nextHash, silent = false) {
        navigate({ page, target: nextHash.replace(/^#/, "") }, { silent });
      },
      bind(nextWindow) {
        frameWindow = nextWindow;
      },
      activate(next, { backward = false, silent = false } = {}) {
        hash = next ? "#" + next : "";
        if (!silent && frameWindow) {
          frameWindow.dispatchEvent(new frameWindow.HashChangeEvent("hashchange"));
          if (backward) frameWindow.dispatchEvent(new frameWindow.PopStateEvent("popstate"));
          scrollToTarget(frameWindow, next, next === "contenido");
        }
      }
    };
  }

  let screen;
  function mount(route, options = {}) {
    const samePage = current?.page === route.page;
    current = route;
    if (samePage) {
      screen.activate(route.target, options);
      return;
    }

    const lesson = resources.pages[route.page];
    screen = createScreen(route.page, route.target);
    document.title = lesson.title + " · Vita-Cora sin conexión";
    const css = lesson.styles.map(name => resources.styles[name]).join("\n");
    const headEnd = "<" + "/head>";
    const bodyEnd = "<" + "/body>";
    const scriptStart = "<" + "script>";
    const scriptEnd = "<" + "/script>";
    const boot = scriptStart + "window.vitaScreen = parent.vitaOffline.bind(window, " +
      JSON.stringify(route.page) + ");" + scriptEnd;
    const html = lesson.html
      .replace(headEnd, () => "<style>" + css + "</style>" + headEnd)
      .replace(bodyEnd, () => boot + scriptStart + lesson.script + scriptEnd + bodyEnd);
    const frame = document.createElement("iframe");
    frame.id = file.id;
    frame.title = lesson.title;
    frame.srcdoc = html;
    file.replaceWith(frame);
    file = frame;
  }

  function navigate(route, options = {}) {
    const address = key(route);
    if (address !== location.hash) history.pushState(null, "", address);
    mount(route, options);
  }

  window.vitaOffline = {
    storage,
    download(text, filename) {
      const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    bind(frameWindow, page) {
      const bound = screen;
      bound.bind(frameWindow);
      frameWindow.document.addEventListener("click", event => {
        const link = event.target.closest?.("a[href]");
        if (event.defaultPrevented || !link || link.hasAttribute("download")) return;
        const href = link.getAttribute("href");
        const route = resolve(href, page);
        if (!route) return;
        event.preventDefault();
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          const destination = new URL(location.href);
          destination.hash = key(route);
          window.open(destination.href, "_blank", "noopener");
          return;
        }
        navigate(route);
      });

      frameWindow.addEventListener("load", () => {
        if (bound === screen && current.target) scrollToTarget(frameWindow, current.target, current.target === "contenido");
      }, { once: true });
      return bound;
    }
  };
  const restore = () => {
    const route = fromHash();
    if (key(route) !== key(current)) mount(route, { backward: true });
  };
  window.addEventListener("popstate", restore);
  window.addEventListener("hashchange", restore);
  mount(fromHash());
})();
