// Adds working Copy buttons to code blocks rendered by
// layouts/_default/_markup/render-codeblock.html.
(function () {
  "use strict";

  const RESET_AFTER_MS = 2000;

  function fallbackCopy(text) {
    // For browsers or contexts without the async Clipboard API.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } finally {
      document.body.removeChild(area);
    }
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return fallbackCopy(text);
  }

  function setState(button, text, state) {
    button.textContent = text;
    button.dataset.state = state;
    window.clearTimeout(button._resetTimer);
    button._resetTimer = window.setTimeout(function () {
      button.textContent = button.dataset.label;
      delete button.dataset.state;
    }, RESET_AFTER_MS);
  }

  document.querySelectorAll(".code-block").forEach(function (block) {
    const button = block.querySelector(".code-block__copy");
    const code = block.querySelector("pre code") || block.querySelector("pre");
    if (!button || !code) {
      return;
    }

    // Announce the result to screen readers.
    button.setAttribute("aria-live", "polite");
    button.hidden = false;

    button.addEventListener("click", function () {
      // Drop the trailing newline so pasted commands don't run on their own.
      const text = code.innerText.replace(/\n$/, "");
      copyText(text).then(
        function () {
          setState(button, button.dataset.copied, "copied");
        },
        function () {
          setState(button, button.dataset.failed, "failed");
        }
      );
    });
  });
})();
