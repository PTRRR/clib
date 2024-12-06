document.addEventListener("DOMContentLoaded", () => {
  const autopilotScript = document.querySelector("script[autopilot][nomodule]");

  if (autopilotScript) {
    const thinking = document.createElement("span");
    thinking.innerHTML = "Thinking...";
    thinking.style.position = "absolute";
    thinking.style.top = "50%";
    thinking.style.left = "50%";
    thinking.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(thinking);

    const scriptContent = autopilotScript.innerHTML;

    fetch("https://clocks-lib.vpr-group.ch/api/autopilot", {
      method: "POST",
      body: JSON.stringify({
        script: scriptContent,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const json = await res.json();

        const newScriptElement = document.createElement("script");
        newScriptElement.setAttribute("type", "module");
        newScriptElement.innerHTML = json.script;

        document.body.appendChild(newScriptElement);
        document.body.removeChild(thinking);
      })
      .catch((error) => {
        console.log(error);
        thinking.innerHTML = "There was an error...";
      });
  }
});
