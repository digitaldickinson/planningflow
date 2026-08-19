#!/usr/bin/env node
/*
 * Regenerates the static "whole map" HTML from js/data.js and prints it
 * to stdout. Paste the output into index.html inside #map-body.
 *
 * Run whenever the decision tree in js/data.js changes:
 *   node tools/generate-map.js
 */
"use strict";

var path = require("path");
var { NODES, START } = require(path.join(__dirname, "..", "js", "data.js"));

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

function truncate(q) {
  return q.length > 34 ? q.slice(0, 32).replace(/[\s—,]+$/, "") + "…" : q;
}

function shortLabel(node) {
  return truncate(node.q || node.eyebrow || "");
}

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

process.stdout.write(buildMap() + "\n");
