export function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  let time = t;
  time /= d / 2;
  if (time < 1) {
    return c / 2 * time * time + b;
  }
  time -= 1;
  return -c / 2 * (time * (time - 2) - 1) + b;
}

export function getDisplayName(Component: React.ComponentType<any>) {
  return (
    Component.displayName ||
    Component.name ||
    (Component instanceof String && Component.length > 0 ? Component : 'Unknown')
  );
}

export const requestAnimFrame = (() =>
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  })();
