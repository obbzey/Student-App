/* Static data + helpers (no UI here) */
const ROUTES = {
  A: { name: "Route A", label: "Main Gate ↔ Library",  color: "#2563eb", bus: "SH-101", tag: "Peak",              speed: .00006,
       pts: [[20,210],[80,180],[140,150],[200,110],[270,70],[340,50]] },
  B: { name: "Route B", label: "Hostels ↔ Faculty",    color: "#e11d48", bus: "SH-204", tag: "Peak",              speed: .00005,
       pts: [[20,60],[90,90],[150,140],[220,190],[290,200],[340,225]] },
  C: { name: "Route C", label: "Sports Complex Loop",  color: "#059669", bus: "SH-307", tag: "Off-peak · 2× pts", speed: .00004,
       pts: [[50,235],[110,205],[190,175],[250,125],[300,125],[345,150]] },
};
const INITIAL_SEATS = { A: 24, B: 17, C: 9 };   // free seats out of 30
const REDEEM_COST = 400;
const OFF_PEAK_BONUS = 50;

/* Point at fraction t (0..1) along a polyline */
function pointAlong(pts, t) {
  const seg = []; let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1]);
    seg.push(d); total += d;
  }
  let dist = t * total;
  for (let i = 0; i < seg.length; i++) {
    if (dist <= seg[i]) {
      const k = dist / seg[i];
      return [pts[i][0] + (pts[i+1][0] - pts[i][0]) * k, pts[i][1] + (pts[i+1][1] - pts[i][1]) * k];
    }
    dist -= seg[i];
  }
  return pts[pts.length - 1];
}

/* Simulated bus progress along its route */
function busProgress(routeKey, busIndex, now) {
  return (now * ROUTES[routeKey].speed * (1 + busIndex * .15) + busIndex * .5 + routeKey.charCodeAt(0) * .13) % 1;
}
