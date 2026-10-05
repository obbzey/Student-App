/* Root component: owns state and wires sections together */
function App({ user, onLogout }) {
  const [now, setNow] = useState(0);
  const [sel, setSel] = useState("A");
  const [sheet, setSheet] = useState(false);
  const [seats, setSeats] = useState(INITIAL_SEATS);
  const [booking, setBooking] = useState(null);
  const [pay, setPay] = useState("card");
  const [qr, setQr] = useState(false);
  const [points, setPoints] = useState(380);
  const [voucher, setVoucher] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {                       // animation clock for the buses
    let id; const loop = t => { setNow(t); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const eta = Math.max(1, Math.round((1 - busProgress(sel, 0, now)) * 9));

  function reserve() {
    if (seats[sel] < 1) return;
    const seat = 30 - seats[sel] + 1;
    setSeats({ ...seats, [sel]: seats[sel] - 1 });
    setBooking({ route: sel, bus: ROUTES[sel].bus, seat, eta });
    if (sel === "C") {
      setPoints(p => p + OFF_PEAK_BONUS);
      setToast(`+${OFF_PEAK_BONUS} off-peak points earned!`);
      setTimeout(() => setToast(""), 2600);
    }
  }
  function cancel() {
    setSeats(s => ({ ...s, [booking.route]: s[booking.route] + 1 }));
    setBooking(null);
  }
  function redeem() {
    if (points < REDEEM_COST) return;
    setPoints(p => p - REDEEM_COST);
    setVoucher("CAFE-" + Math.random().toString(36).slice(2, 7).toUpperCase());
  }

  return html`
  <${PhoneFrame}>

      <div className="px-5 pt-5 pb-3 flex items-center justify-between bg-white">
        <div><p className="text-xs text-slate-500">Hi, ${user} 👋</p><h1 className="text-lg font-bold text-slate-900 leading-tight">Where to today?</h1></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-700 rounded-full px-3 py-1.5 text-sm font-semibold"><${Icon} n="coins" s=${16}/>${points}</div>
          <button onClick=${onLogout} title="Log out" className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><${Icon} n="log-out" s=${16}/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <${MapCard} sel=${sel} setSel=${setSel} now=${now} eta=${eta}/>
        <${PaymentCard} pay=${pay} setPay=${setPay} openQr=${() => setQr(true)}/>
        <${RewardsCard} points=${points} redeem=${redeem}/>
      </div>

      ${!sheet && html`
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          <button onClick=${() => setSheet(true)} className="w-full bg-slate-900 text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 shadow-lg">
            <${Icon} n="armchair" s=${18}/> ${booking ? "View my reservation" : "Reserve a seat"}
          </button>
        </div>`}

      ${sheet && html`<${ReserveSheet} sel=${sel} setSel=${setSel} seats=${seats} eta=${eta} booking=${booking} pay=${pay}
        reserve=${reserve} cancel=${cancel} close=${() => setSheet(false)}/>`}

      ${qr && html`<${Modal} onClose=${() => setQr(false)}>
        <h3 className="font-bold text-slate-900 text-lg">MAE / Touch 'n Go QR</h3>
        <p className="text-xs text-slate-500 mb-4">Scan at the bus validator to pay</p>
        <${QR}/>
        <p className="text-[11px] text-slate-400 mt-3">Simulated code · refreshes every 60s</p>
        <button onClick=${() => setQr(false)} className="mt-4 w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm">Close</button>
      <//>`}

      ${voucher && html`<${Modal} onClose=${() => setVoucher(null)}>
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3"><${Icon} n="coffee" s=${28}/></div>
        <h3 className="font-bold text-slate-900 text-lg">Voucher unlocked</h3>
        <p className="text-xs text-slate-500 mb-3">Show this at Campus Cafe</p>
        <div className="font-mono text-2xl font-bold tracking-widest bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl py-3">${voucher}</div>
        <button onClick=${() => setVoucher(null)} className="mt-4 w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm">Done</button>
      <//>`}

      ${toast && html`<div className="absolute top-20 inset-x-0 z-40 flex justify-center"><div className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">${toast}</div></div>`}
  <//>`;
}

/* Root: Login -> Student home */
function Root() {
  const [user, setUser] = useState(null);
  if (!user) return html`<${PhoneFrame}><${LoginScreen} onLogin=${setUser}/><//>`;
  return html`<${App} user=${user} onLogout=${() => setUser(null)}/>`;
}

ReactDOM.createRoot(document.getElementById("root")).render(html`<${Root}/>`);
