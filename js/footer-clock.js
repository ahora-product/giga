(function () {
  var el = document.querySelector("[data-footer-clock]");
  var offsetEl = document.querySelector("[data-footer-clock-offset]");
  if (!el) return;

  var TZ = "Europe/Madrid";

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function utcOffsetLabel(date) {
    var tryNames = ["shortOffset", "longOffset"];
    for (var t = 0; t < tryNames.length; t++) {
      try {
        var parts = new Intl.DateTimeFormat("en-US", {
          timeZone: TZ,
          timeZoneName: tryNames[t],
        }).formatToParts(date);
        for (var i = 0; i < parts.length; i++) {
          if (parts[i].type === "timeZoneName") {
            var raw = String(parts[i].value);
            if (raw) return raw.replace(/^GMT/i, "UTC");
          }
        }
      } catch (e2) {}
    }
    var offMin = -date.getTimezoneOffset();
    var sign = offMin >= 0 ? "+" : "-";
    var abs = Math.abs(offMin);
    return "UTC" + sign + Math.floor(abs / 60);
  }

  function tick() {
    var now = new Date();
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(now);
      var v = function (type) {
        for (var i = 0; i < parts.length; i++) {
          if (parts[i].type === type) return parts[i].value;
        }
        return "00";
      };
      el.textContent = v("hour") + ":" + v("minute") + ":" + v("second");
    } catch (e) {
      el.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    }
    if (offsetEl) offsetEl.textContent = utcOffsetLabel(now) || "";
  }

  tick();
  window.setInterval(tick, 1000);
})();
