export function rootPrefix() {
  const depth = Number(document.body?.dataset.depth || 0);
  return depth > 0 ? "../".repeat(depth) : "";
}

export function asset(path) {
  return rootPrefix() + path.replace(/^\//, "");
}
