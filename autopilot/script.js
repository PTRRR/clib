document.addEventListener("DOMContentLoaded", () => {
  const styles = document.createElement("style");
  styles.textContent = `
    .modal {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 16px;
      max-width: 300px;
      transform: translateY(100%);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1000;
    }
    .modal.show {
      transform: translateY(0);
      opacity: 1;
    }
    .modal-content {
      margin-bottom: 12px;
      color: #333;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .modal-close {
      position: absolute;
      top: 0px;
      right: 8px;
      border: none;
      background: none;
      cursor: pointer;
      padding: 4px;
      color: #666;
      font-size: 2rem;
      line-height: 1;
    }
    .copy-button, .retry-button {
      background: #0070f3;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-family: system-ui;
      font-size: 14px;
      transition: background 0.2s;
      margin-right: 8px;
    }
    .copy-button:hover, .retry-button:hover {
      background: #0051b3;
    }
    .retry-button {
      background: #666;
    }
    .retry-button:hover {
      background: #444;
    }
    .button-container {
      display: flex;
      gap: 8px;
    }
  `;
  document.head.appendChild(styles);

  function processScript(scriptContent, thinking, retryCount = 0) {
    thinking.innerHTML =
      retryCount > 0
        ? `Thinking... (Retry attempt ${retryCount})`
        : "Thinking...";

    fetch("https://clocks-lib.vpr-group.ch/api/autopilot", {
      method: "POST",
      body: JSON.stringify({ script: scriptContent }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const json = await res.json();
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
          <button class="modal-close">×</button>
          <div class="modal-content">${json.message}</div>
          <div class="button-container">
            <button class="copy-button">Copy Corrected Script</button>
          </div>
        `;
        document.body.appendChild(modal);

        modal
          .querySelector(".modal-close")
          .addEventListener("click", () => modal.remove());
        modal
          .querySelector(".copy-button")
          .addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText(json.script);
              const btn = modal.querySelector(".copy-button");
              btn.textContent = "Copied!";
              setTimeout(
                () => (btn.textContent = "Copy Corrected Script"),
                2000
              );
            } catch (err) {
              console.error("Failed to copy:", err);
            }
          });

        setTimeout(() => modal.classList.add("show"), 100);

        const newScriptElement = document.createElement("script");
        newScriptElement.setAttribute("type", "module");
        newScriptElement.innerHTML = json.script;
        document.body.appendChild(newScriptElement);
        document.body.removeChild(thinking);
      })
      .catch((error) => {
        console.error(error);
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
          <button class="modal-close">×</button>
          <div class="modal-content">There was an error processing your script.</div>
          <div class="button-container">
            <button class="retry-button">Retry</button>
          </div>
        `;
        document.body.appendChild(modal);

        modal
          .querySelector(".modal-close")
          .addEventListener("click", () => modal.remove());
        modal.querySelector(".retry-button").addEventListener("click", () => {
          modal.remove();
          processScript(scriptContent, thinking, retryCount + 1);
        });

        setTimeout(() => modal.classList.add("show"), 100);
        document.body.removeChild(thinking);
      });
  }

  const autopilotScript = document.querySelector("script[autopilot][nomodule]");
  if (autopilotScript) {
    const thinking = document.createElement("span");
    thinking.innerHTML = "Thinking...";
    thinking.style.position = "absolute";
    thinking.style.top = "50%";
    thinking.style.left = "50%";
    thinking.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(thinking);

    processScript(autopilotScript.innerHTML, thinking);
  }
});
