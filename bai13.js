const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

let expr = "";

const displayMap = { "/": "\u00F7", "*": "\u00D7", "-": "\u2212" };

function toDisplay(s) {
  return s.replace(/[*/-]/g, (c) => displayMap[c]);
}

function evaluate(s) {
  if (!s) return null;
  const js = s.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
  if (!/^[0-9+\-*/(). ]+$/.test(js)) return null;
  try {
    return Function('"use strict"; return (' + js + ")")();
  } catch {
    return null;
  }
}

function formatNumber(n) {
  if (n === null || n === undefined || isNaN(n) || !isFinite(n)) return "L\u1ED7i";
  return String(parseFloat(n.toFixed(10)));
}

function insertParen() {
  const open = (expr.match(/\(/g) || []).length;
  const close = (expr.match(/\)/g) || []).length;
  if (!expr || /[+\-*/(]$/.test(expr)) {
    expr += "(";
  } else if (open > close) {
    expr += ")";
  } else {
    expr += "(";
  }
}

function update() {
  expressionEl.textContent = toDisplay(expr) || "0";
  if (!expr) {
    resultEl.textContent = "";
    return;
  }
  const val = evaluate(expr);
  resultEl.textContent = val === null ? "" : formatNumber(val);
}

function press(key) {
  const action = key.dataset.action;
  const value = key.dataset.value;
  if (action === "clear") {
    expr = "";
  } else if (action === "paren") {
    insertParen();
  } else if (action === "percent") {
    expr += "%";
  } else if (action === "equals") {
    const val = evaluate(expr);
    if (val !== null) expr = String(parseFloat(val.toFixed(10)));
  } else if (value !== undefined) {
    expr += value;
  }
  update();
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => press(btn));
});

document.addEventListener("keydown", (e) => {
  const keyMap = { Enter: "=", Escape: "C", x: "*", X: "*", ",": "." };
  const k = keyMap[e.key] ?? e.key;
  if (/^[0-9.+\-*/]$/.test(k)) {
    expr += k;
    update();
  } else if (k === "=") {
    const val = evaluate(expr);
    if (val !== null) expr = String(parseFloat(val.toFixed(10)));
    update();
  } else if (k === "C") {
    expr = "";
    update();
  } else if (k === "Backspace") {
    expr = expr.slice(0, -1);
    update();
  }
});

update();