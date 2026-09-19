(function () {
  var script = document.currentScript;
  if (!script) return;
  var key = script.getAttribute("data-key");
  if (!key) return;
  var origin = new URL(script.src).origin;
  var frame = document.createElement("iframe");
  frame.src = origin + "/embed/" + encodeURIComponent(key);
  frame.title = "Recevia";
  frame.style.position = "fixed";
  frame.style.right = "16px";
  frame.style.bottom = "16px";
  frame.style.width = "360px";
  frame.style.height = "520px";
  frame.style.border = "0";
  frame.style.zIndex = "2147483647";
  frame.style.background = "transparent";
  document.body.appendChild(frame);
})();
