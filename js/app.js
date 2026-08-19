(function () {
  "use strict";

  var state = { path: [], current: START, data: {}, notes: "" };

  var stage = document.getElementById("stage");
  var trailEl = document.getElementById("trail");
  var nbBody = document.getElementById("nb-body");
  var nbNotes = document.getElementById("nb-notes");
  var mapSection = document.getElementById("map");

  var FIELD_LABELS = {
    premises: "Premises", borough: "Borough", repdate: "Representations by",
    hearing: "Hearing date", ref: "Application ref", site: "Site address",
    deadline: "Comment deadline", patch: "Watching", appeal: "Appeal ref",
    permitted: "What was permitted", licence: "Licence number"
  };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* =========================================================
     RENDER
     ========================================================= */

  function render() {
    var node = NODES[state.current];
    if (!node) { stage.innerHTML = "<p>Lost the thread. Start again.</p>"; return; }
    if (node.type === "q") renderQuestion(node);
    else if (node.type === "step") renderStep(node);
    else renderEnd(node);
    renderTrail();
    renderNotebook();
    document.getElementById("btn-back").disabled = state.path.length === 0;
  }

  function renderQuestion(node) {
    var html = "";
    if (node.eyebrow) html += '<p class="eyebrow">' + esc(node.eyebrow) + "</p>";
    html += '<h2 class="question">' + esc(node.q) + "</h2>";
    if (node.why) html += '<p class="why">' + esc(node.why) + "</p>";
    html += '<div class="options">';
    node.options.forEach(function (opt, i) {
      html += '<button class="opt" type="button" data-i="' + i + '">';
      if (opt.thumb) html += '<img class="thumb" src="' + esc(opt.thumb) + '" alt="" loading="lazy">';
      else if (opt.swatch) html += '<span class="swatch-lg" style="background:' + opt.swatch + '"></span>';
      else html += '<span class="key">' + (i + 1) + "</span>";
      html += '<span class="body"><span class="label">' + esc(opt.label) + "</span>";
      if (opt.note) html += '<span class="note">' + esc(opt.note) + "</span>";
      html += "</span></button>";
    });
    html += "</div>";
    stage.innerHTML = html;

    Array.prototype.forEach.call(stage.querySelectorAll(".opt"), function (btn) {
      btn.addEventListener("click", function () {
        choose(node.options[Number(btn.dataset.i)]);
      });
    });
  }

  function renderStep(node) {
    var html = "";
    if (node.eyebrow) html += '<p class="eyebrow">' + esc(node.eyebrow) + "</p>";
    if (node.q) html += '<h2 class="question">' + esc(node.q) + "</h2>";
    if (node.image) {
      html += '<figure class="ref-photo"><img src="' + esc(node.image.src) + '" alt="' + esc(node.image.alt || "") + '" loading="lazy">';
      if (node.image.caption) html += "<figcaption>" + esc(node.image.caption) + "</figcaption>";
      html += "</figure>";
    }
    if (node.body) html += '<p class="step-body">' + node.body + "</p>";
    if (node.capture && node.capture.length) {
      html += '<div class="capture">';
      node.capture.forEach(function (f) {
        var val = state.data[f.key] ? esc(state.data[f.key]) : "";
        html += "<div><label for=\"cap-" + f.key + '">' + esc(f.label) + "</label>";
        html += '<input id="cap-' + f.key + '" data-key="' + f.key + '" value="' + val + '" autocomplete="off"></div>';
      });
      html += "</div>";
    }
    html += '<button class="primary" type="button" id="btn-next">Next</button>';
    stage.innerHTML = html;

    document.getElementById("btn-next").addEventListener("click", function () {
      Array.prototype.forEach.call(stage.querySelectorAll(".capture input"), function (inp) {
        var v = inp.value.trim();
        if (v) state.data[inp.dataset.key] = v; else delete state.data[inp.dataset.key];
      });
      choose({ label: "Done", to: node.to });
    });
  }

  function renderEnd(node) {
    var html = '<div class="verdict ' + node.kind + '">';
    html += "<h2>" + esc(node.title) + "</h2>";
    html += '<p class="lead">' + esc(node.lead) + "</p>";
    if (node.actions && node.actions.length) {
      html += "<h3>Next moves</h3><ul>";
      node.actions.forEach(function (a) { html += "<li>" + a + "</li>"; });
      html += "</ul>";
    }
    if (node.tail) html += '<h3>And</h3><p class="lead" style="margin-bottom:0">' + esc(node.tail) + "</p>";
    html += "</div>";

    var judgements = state.path.filter(function (p) { return p.judgement; });
    html += '<div class="judgement"><h3>Judgement calls on this route</h3>';
    if (judgements.length) {
      html += "<ul>";
      judgements.forEach(function (p) { html += "<li>" + esc(p.judgement) + "</li>"; });
      html += "</ul>";
    } else {
      html += '<p style="font-size:0.9rem;margin:0">No flagged judgement calls on this route — though you still chose every branch yourself.</p>';
    }
    if (judgements.length) {
      html += '<p class="tail">Each of these was yours. The tool routed you to the right document; reading it and deciding what it meant was not something it did.</p>';
    }
    html += "</div>";

    html += '<div class="verdict-actions">';
    html += '<button type="button" id="btn-back2">Back one step</button>';
    html += '<button type="button" id="btn-restart2">Start again</button>';
    html += "</div>";

    stage.innerHTML = html;
    document.getElementById("btn-back2").addEventListener("click", back);
    document.getElementById("btn-restart2").addEventListener("click", restart);
  }

  function renderTrail() {
    trailEl.innerHTML = "";
    state.path.forEach(function (p, i) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.className = "chip";
      btn.type = "button";
      btn.innerHTML = esc(p.short) + " <strong>" + esc(p.label) + "</strong>";
      btn.title = "Go back to this question";
      btn.addEventListener("click", function () { rewind(i); });
      li.appendChild(btn);
      if (i < state.path.length - 1) {
        var sep = document.createElement("span");
        sep.className = "sep";
        sep.textContent = "›";
        li.appendChild(sep);
      }
      trailEl.appendChild(li);
    });
  }

  function renderNotebook() {
    var keys = Object.keys(state.data);
    if (!keys.length) {
      nbBody.innerHTML = '<p class="nb-empty">Details you record on the way — reference numbers, boroughs, deadlines — collect here.</p>';
      return;
    }
    var html = '<ul class="nb-list">';
    keys.forEach(function (k) {
      html += '<li><span class="k">' + esc(FIELD_LABELS[k] || k) + '</span><span class="v">' + esc(state.data[k]) + "</span></li>";
    });
    html += "</ul>";
    nbBody.innerHTML = html;
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  function choose(opt) {
    var node = NODES[state.current];
    var isStep = node.type === "step";
    state.path.push({
      from: state.current,
      short: isStep ? truncate(node.q || node.eyebrow || "Step") : shortLabel(node),
      label: isStep ? "✓" : opt.label,
      judgement: opt.judgement || null
    });
    state.current = opt.to;
    render();
    stage.focus();
  }

  function truncate(q) {
    return q.length > 34 ? q.slice(0, 32).replace(/[\s—,]+$/, "") + "…" : q;
  }

  function shortLabel(node) {
    return truncate(node.q || node.eyebrow || "");
  }

  function back() {
    if (!state.path.length) return;
    var last = state.path.pop();
    state.current = last.from;
    render();
    stage.focus();
  }

  function rewind(i) {
    var target = state.path[i];
    state.path = state.path.slice(0, i);
    state.current = target.from;
    render();
    stage.focus();
  }

  function restart() {
    state.path = [];
    state.current = START;
    render();
    stage.focus();
  }

  /* =========================================================
     NOTEBOOK EXPORT
     ========================================================= */

  function notebookText() {
    var lines = ["PLANNING / LICENSING — story check", ""];
    Object.keys(state.data).forEach(function (k) {
      lines.push((FIELD_LABELS[k] || k) + ": " + state.data[k]);
    });
    if (Object.keys(state.data).length) lines.push("");
    lines.push("Route taken:");
    state.path.forEach(function (p) {
      lines.push("  - " + p.short + " -> " + p.label);
    });
    var node = NODES[state.current];
    if (node && node.type === "end") {
      lines.push("");
      lines.push("Verdict: " + node.title);
      if (node.actions) {
        lines.push("Next moves:");
        node.actions.forEach(function (a) {
          lines.push("  - " + a.replace(/<[^>]+>/g, ""));
        });
      }
    }
    var j = state.path.filter(function (p) { return p.judgement; });
    if (j.length) {
      lines.push("");
      lines.push("Judgement calls on this route:");
      j.forEach(function (p) { lines.push("  - " + p.judgement); });
    }
    if (state.notes.trim()) {
      lines.push("");
      lines.push("My notes:");
      lines.push(state.notes.trim());
    }
    return lines.join("\n");
  }

  function copyNotebook() {
    var text = notebookText();
    var btn = document.getElementById("btn-copy");
    var done = function () {
      var old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(function () { btn.textContent = old; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { window.prompt("Copy this:", text); }
    document.body.removeChild(ta);
  }

  /* =========================================================
     THE WHOLE MAP
     ========================================================= */

  function buildMap() {
    var seen = {};
    function walk(id, edgeLabel) {
      var node = NODES[id];
      if (!node) return "";
      var li = "<li>";
      if (edgeLabel) li += '<span class="edge">' + esc(edgeLabel) + " → </span>";
      if (seen[id]) {
        li += '<span class="rev">' + esc(shortLabel(node)) + " (as above)</span></li>";
        return li;
      }
      seen[id] = true;
      if (node.type === "end") {
        li += '<span class="t ' + node.kind + '">' + esc(node.title) + "</span></li>";
        return li;
      }
      li += '<span class="q">' + esc(node.q || node.eyebrow || id) + "</span>";
      li += "<ul>";
      if (node.type === "step") {
        li += walk(node.to, "then");
      } else {
        node.options.forEach(function (o) { li += walk(o.to, o.label); });
      }
      li += "</ul></li>";
      return li;
    }
    return "<ul>" + walk(START, null) + "</ul>";
  }

  /* =========================================================
     WIRING
     ========================================================= */

  document.getElementById("btn-restart").addEventListener("click", restart);
  document.getElementById("btn-back").addEventListener("click", back);
  document.getElementById("btn-copy").addEventListener("click", copyNotebook);
  document.getElementById("btn-clear").addEventListener("click", function () {
    state.data = {};
    state.notes = "";
    nbNotes.value = "";
    renderNotebook();
  });
  nbNotes.addEventListener("input", function () { state.notes = nbNotes.value; });

  document.getElementById("btn-map").addEventListener("click", function () {
    var open = mapSection.classList.toggle("hidden") === false;
    this.setAttribute("aria-pressed", String(open));
    this.textContent = open ? "Hide the map" : "Show the whole map";
    if (open && !document.getElementById("map-body").innerHTML) {
      document.getElementById("map-body").innerHTML = buildMap();
    }
  });

  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.key === "Backspace") { e.preventDefault(); back(); return; }
    if (/^[1-9]$/.test(e.key)) {
      var opts = stage.querySelectorAll(".opt");
      var idx = Number(e.key) - 1;
      if (opts[idx]) opts[idx].click();
      else {
        var next = document.getElementById("btn-next");
        if (next && e.key === "1") next.click();
      }
    }
  });

  render();
})();
