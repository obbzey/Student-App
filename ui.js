/* Shared UI primitives */
const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);

/* Lucide icon wrapper */
function Icon({ n, s = 18, c = "" }) {
  const ref = useRef();
  useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = `<i data-lucide="${n}"></i>`;
      lucide.createIcons({ attrs: { width: s, height: s } });
    }
  }, [n, s]);
  return html`<span ref=${ref} className=${"inline-flex items-center " + c}></span>`;
}

/* Centered modal over the phone screen */
function Modal({ children, onClose }) {
  return html`
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/60 p-6" onClick=${onClose}>
      <div className="bg-white rounded-3xl p-6 w-full text-center shadow-2xl" onClick=${e => e.stopPropagation()}>${children}</div>
    </div>`;
}

/* Simulated QR code (seeded pseudo-random pattern + finder squares) */
function QR() {
  const N = 21, cells = []; let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const isFinder = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let on;
    if (isFinder(x, y)) {
      const fx = x > 12 ? x - 14 : x, fy = y > 12 ? y - 14 : y;
      on = fx < 7 && fy < 7 && (fx == 0 || fx == 6 || fy == 0 || fy == 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5));
    } else on = rnd() > .5;
    if (on) cells.push(html`<rect key=${x + "-" + y} x=${x} y=${y} width="1" height="1"/>`);
  }
  return html`<svg viewBox="-1 -1 23 23" className="w-48 h-48 mx-auto" fill="#0f172a">${cells}</svg>`;
}

/* Phone-sized frame shared by every screen */
function PhoneFrame({ children }) {
  return html`
    <div className="h-full flex items-center justify-center p-2">
      <div className="phone relative w-full max-w-[400px] bg-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-slate-900 flex flex-col">${children}</div>
    </div>`;
}
