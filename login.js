/* UC-01 step 1: student sign-in (prototype only, no real auth) */
const DEMO_USER = "Klust";
const DEMO_PASS = "1234";

function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (user.trim().toLowerCase() === DEMO_USER.toLowerCase() && pass === DEMO_PASS) onLogin(DEMO_USER);
    else setError("Incorrect username or password. Please try again.");
  }

  const field = "w-full flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus-within:border-blue-600 focus-within:bg-white transition";

  return html`
  <div className="flex-1 flex flex-col overflow-y-auto">
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 pt-14 pb-12 rounded-b-[2rem] text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/20 mx-auto flex items-center justify-center mb-3"><${Icon} n="bus" s=${34}/></div>
      <h1 className="text-2xl font-extrabold tracking-tight">CampusShuttle</h1>
      <p className="text-sm opacity-90 mt-1">Track. Reserve. Ride.</p>
    </div>

    <form onSubmit=${submit} className="px-6 pt-7 pb-6 flex-1 flex flex-col">
      <h2 className="text-lg font-bold text-slate-900">Welcome back</h2>
      <p className="text-xs text-slate-500 mb-5">Sign in with your student account to book a ride.</p>

      <label className="text-xs font-semibold text-slate-600 mb-1">Username</label>
      <div className=${field + " mb-4"}>
        <${Icon} n="user" s=${18} c="text-slate-400"/>
        <input value=${user} onInput=${e => { setUser(e.target.value); setError(""); }} autoComplete="username"
          placeholder="Enter your username" className="flex-1 bg-transparent outline-none text-sm text-slate-900"/>
      </div>

      <label className="text-xs font-semibold text-slate-600 mb-1">Password</label>
      <div className=${field}>
        <${Icon} n="lock" s=${18} c="text-slate-400"/>
        <input value=${pass} onInput=${e => { setPass(e.target.value); setError(""); }} type=${show ? "text" : "password"} autoComplete="current-password"
          placeholder="Enter your password" className="flex-1 bg-transparent outline-none text-sm text-slate-900"/>
        <button type="button" onClick=${() => setShow(!show)} className="text-slate-400"><${Icon} n=${show ? "eye-off" : "eye"} s=${18}/></button>
      </div>

      ${error && html`<p className="mt-3 text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2 flex items-center gap-1.5"><${Icon} n="alert-circle" s=${14}/> ${error}</p>`}

      <button type="submit" className="mt-6 w-full bg-slate-900 text-white rounded-2xl py-3.5 font-semibold shadow-lg">Log In</button>

      <p className="text-center text-sm text-slate-500 mt-5">New student?
        <button type="button" onClick=${() => setNote(true)} className="font-semibold text-blue-600 ml-1">Register</button>
      </p>
      ${note && html`<p className="mt-3 text-xs text-slate-500 bg-slate-100 rounded-lg px-3 py-2 text-center">Registration (FR-01) is documented but not simulated in this prototype.</p>`}

      <p className="mt-auto pt-6 text-center text-[11px] text-slate-400">Demo account: ${DEMO_USER} / ${DEMO_PASS}</p>
    </form>
  </div>`;
}
