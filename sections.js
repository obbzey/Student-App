/* Feature sections: map, payment, rewards, reservation sheet */

/* 1. Live bus tracking */
function MapCard({ sel, setSel, now, eta }) {
  const R = ROUTES[sel];
  return html`
  <div className="relative bg-white px-3 pb-3">
    <div className="flex gap-2 pb-2 overflow-x-auto">
      ${Object.entries(ROUTES).map(([k, r]) => html`
        <button key=${k} onClick=${() => setSel(k)}
          className=${"shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition " + (sel === k ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200")}
          style=${sel === k ? { background: r.color } : {}}>${r.name}</button>`)}
    </div>
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-[#eef3ea]">
      <svg viewBox="0 0 360 260" className="w-full block">
        <defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#dfe7da" strokeWidth="1"/></pattern></defs>
        <rect width="360" height="260" fill="url(#grid)"/>
        <rect x="130" y="20" width="60" height="38" rx="6" fill="#d7e3cf"/>
        <rect x="250" y="160" width="70" height="40" rx="6" fill="#d7e3cf"/>
        <rect x="30" y="100" width="50" height="34" rx="6" fill="#d7e3cf"/>
        ${Object.entries(ROUTES).map(([k, r]) => html`
          <polyline key=${k} points=${r.pts.map(p => p.join(",")).join(" ")} fill="none" stroke=${r.color}
            strokeWidth=${sel === k ? 5 : 3} strokeLinecap="round" strokeLinejoin="round"
            opacity=${sel === k ? 1 : .3} strokeDasharray=${sel === k ? "" : "2 6"}/>`)}
        ${Object.entries(ROUTES).map(([k, r]) => [0, 1].map(i => {
          const [x, y] = pointAlong(r.pts, busProgress(k, i, now));
          return html`
            <g key=${k + i} transform=${`translate(${x},${y})`} opacity=${sel === k ? 1 : .5}>
              <circle r="11" fill="white" stroke=${r.color} strokeWidth="3"/>
              <text textAnchor="middle" y="4" fontSize="10" fontWeight="700" fill=${r.color}>${k}</text>
            </g>`;
        }))}
        <circle cx="150" cy="150" r="6" fill="#2563eb" opacity=".5" className="pulse"/>
        <circle cx="150" cy="150" r="7" fill="#2563eb" stroke="white" strokeWidth="3"/>
        <text x="162" y="143" fontSize="10" fontWeight="600" fill="#1e3a8a">You</text>
      </svg>
    </div>
    <div className="flex items-center justify-between mt-3 px-1">
      <div>
        <p className="text-sm font-semibold text-slate-900">${R.name} · ${R.label}</p>
        <p className="text-xs text-slate-500 flex items-center gap-1"><${Icon} n="clock" s=${12}/> Next bus in ${eta} min · ${R.bus}</p>
      </div>
      <span className=${"text-[11px] font-semibold px-2 py-1 rounded-full " + (sel === "C" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600")}>${R.tag}</span>
    </div>
  </div>`;
}

/* 3. Payment method toggle */
const PAY_OPTIONS = [
  ["card", "Student ID Card", "Visa / Touch 'n Go",       "id-card"],
  ["qr",   "New Student",     "MAE / Touch 'n Go QR Code", "qr-code"],
];
function PaymentCard({ pay, setPay, openQr }) {
  return html`
  <div className="m-4 mb-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
    <div className="flex items-center gap-2 mb-3"><${Icon} n="credit-card" s=${18} c="text-slate-700"/><h2 className="font-semibold text-slate-900 text-sm">Payment method</h2></div>
    ${PAY_OPTIONS.map(([k, title, sub, icon]) => html`
      <button key=${k} onClick=${() => { setPay(k); if (k === "qr") openQr(); }}
        className=${"w-full flex items-center gap-3 p-3 mb-2 last:mb-0 rounded-xl border-2 text-left transition " + (pay === k ? "border-blue-600 bg-blue-50" : "border-slate-200")}>
        <span className=${"w-9 h-9 rounded-lg flex items-center justify-center " + (pay === k ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}><${Icon} n=${icon} s=${18}/></span>
        <span className="flex-1"><span className="block text-sm font-semibold text-slate-900">${title}</span><span className="block text-xs text-slate-500">${sub}</span></span>
        <span className=${"w-5 h-5 rounded-full border-2 flex items-center justify-center " + (pay === k ? "border-blue-600" : "border-slate-300")}>${pay === k && html`<span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>`}</span>
      </button>`)}
    ${pay === "qr" && html`<button onClick=${openQr} className="mt-2 w-full text-xs font-semibold text-blue-600 flex items-center justify-center gap-1"><${Icon} n="maximize" s=${14}/> Show my QR code</button>`}
  </div>`;
}

/* 4. Gamified rewards */
function RewardsCard({ points, redeem }) {
  const pct = Math.min(100, points / REDEEM_COST * 100);
  return html`
  <div className="mx-4 mb-4 rounded-2xl p-4 text-white shadow-md bg-gradient-to-br from-amber-500 to-orange-600">
    <div className="flex items-center justify-between">
      <div><p className="text-xs opacity-90">Off-peak Rewards</p><p className="text-3xl font-extrabold">${points} <span className="text-sm font-semibold opacity-90">pts</span></p></div>
      <${Icon} n="gift" s=${34} c="opacity-90"/>
    </div>
    <div className="mt-3 h-2 rounded-full bg-white/30 overflow-hidden"><div className="h-full bg-white rounded-full transition-all" style=${{ width: pct + "%" }}></div></div>
    <p className="text-xs mt-1.5 opacity-90">${points >= REDEEM_COST ? "You can redeem a free drink!" : `${REDEEM_COST - points} pts to a free drink · Ride Route C off-peak for 2× points`}</p>
    <button onClick=${redeem} disabled=${points < REDEEM_COST} className="mt-3 w-full bg-white text-orange-600 font-bold text-sm rounded-xl py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
      <${Icon} n="coffee" s=${16}/> Redeem at Campus Cafe · ${REDEEM_COST} pts
    </button>
  </div>`;
}

/* 2. Seat reservation bottom sheet (+ confirmation state) */
function ReserveSheet({ sel, setSel, seats, eta, booking, pay, reserve, cancel, close }) {
  const R = ROUTES[sel];
  return html`
  <div className="absolute inset-0 z-20 bg-slate-900/40 flex items-end" onClick=${close}>
    <div className="sheet bg-white w-full rounded-t-3xl p-5 pb-6" onClick=${e => e.stopPropagation()}>
      <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4"></div>
      ${booking ? html`
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3"><${Icon} n="check-circle-2" s=${30}/></div>
          <h3 className="text-xl font-bold text-slate-900">Seat reserved!</h3>
          <p className="text-sm text-slate-500 mb-4">${ROUTES[booking.route].name} · ${ROUTES[booking.route].label}</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            ${[["Bus", booking.bus], ["Seat", "#" + booking.seat], ["Arrives", booking.eta + " min"]].map(([a, b]) => html`
              <div key=${a} className="bg-slate-50 rounded-xl py-3"><p className="text-[11px] text-slate-500">${a}</p><p className="font-bold text-slate-900">${b}</p></div>`)}
          </div>
          <p className="text-xs text-slate-500 mb-4 flex items-center justify-center gap-1"><${Icon} n=${pay === "qr" ? "qr-code" : "id-card"} s=${13}/> Pay with ${pay === "qr" ? "MAE / Touch 'n Go QR" : "Student ID Card"} when boarding</p>
          <div className="flex gap-2">
            <button onClick=${cancel} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm">Cancel</button>
            <button onClick=${close} className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm">Done</button>
          </div>
        </div>` : html`
        <h3 className="text-lg font-bold text-slate-900 mb-3">Reserve a seat</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          ${Object.entries(ROUTES).map(([k, r]) => html`
            <button key=${k} onClick=${() => setSel(k)} className=${"rounded-xl p-2.5 border-2 text-left transition " + (sel === k ? "bg-slate-50" : "border-slate-200")} style=${sel === k ? { borderColor: r.color } : {}}>
              <span className="block text-xs font-bold" style=${{ color: r.color }}>${r.name}</span>
              <span className="block text-sm font-bold text-slate-900">${seats[k]}/30</span>
              <span className="block text-[10px] text-slate-500">seats free</span>
            </button>`)}
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1"><span>${R.bus} · arrives in ${eta} min</span><span className="font-semibold text-slate-800">${seats[sel]} of 30 available</span></div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full" style=${{ width: seats[sel] / 30 * 100 + "%", background: R.color }}></div></div>
        </div>
        ${sel === "C" && html`<p className="text-xs bg-emerald-50 text-emerald-700 rounded-lg px-3 py-2 mb-3 flex items-center gap-1.5"><${Icon} n="sparkles" s=${14}/> Off-peak ride: earn +${OFF_PEAK_BONUS} reward points</p>`}
        <button onClick=${reserve} disabled=${seats[sel] < 1} className="w-full py-3.5 rounded-2xl text-white font-semibold disabled:opacity-50" style=${{ background: R.color }}>Reserve seat on ${R.name}</button>`}
    </div>
  </div>`;
}
