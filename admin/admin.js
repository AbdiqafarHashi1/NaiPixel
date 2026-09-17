const cfg = window.NP_CONFIG || {};
const authScreen = document.getElementById('auth-screen');
const appShell = document.getElementById('app-shell');
const authMessage = document.getElementById('auth-message');
const connectionStatus = document.getElementById('connection-status');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout');

const hasConfig = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
const db = hasConfig ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;

const money = value => `KES ${Number(value || 0).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function setConnection(text, ok = false) {
  connectionStatus.textContent = text;
  connectionStatus.classList.toggle('ok', ok);
}

function table(headers, rows) {
  if (!rows.length) return '<p>No records yet.</p>';
  return `<table class="data-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

async function verifyAdmin(userId) {
  const { data, error } = await db.from('profiles').select('role').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data?.role === 'admin';
}

async function loadOverview() {
  const [{ data: payments }, { count: leads }, { count: customers }, { count: products }] = await Promise.all([
    db.from('payments').select('amount').eq('status', 'paid'),
    db.from('leads').select('*', { count: 'exact', head: true }).not('status', 'in', '(won,lost,suppressed)'),
    db.from('customers').select('*', { count: 'exact', head: true }),
    db.from('products').select('*', { count: 'exact', head: true }).eq('active', true)
  ]);
  const revenue = (payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  document.getElementById('metric-revenue').textContent = money(revenue);
  document.getElementById('metric-leads').textContent = leads ?? 0;
  document.getElementById('metric-customers').textContent = customers ?? 0;
  document.getElementById('metric-products').textContent = products ?? 0;
}

async function loadProducts() {
  const { data, error } = await db.from('products').select('name,kind,price_kes,billing_period,active').order('sort_order');
  if (error) throw error;
  document.getElementById('product-list').innerHTML = table(['Product','Type','Price','Billing','Status'], (data || []).map(p => `<tr><td>${esc(p.name)}</td><td>${esc(p.kind)}</td><td>${money(p.price_kes)}</td><td>${esc(p.billing_period || 'One-off')}</td><td><span class="pill">${p.active ? 'Live' : 'Hidden'}</span></td></tr>`));
}

async function loadLeads() {
  const { data, error } = await db.from('leads').select('id,status,assigned_offer,value_estimate_kes,created_at,businesses(name,category)').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  document.getElementById('lead-list').innerHTML = table(['Business','Category','Status','Offer','Value'], (data || []).map(l => `<tr><td>${esc(l.businesses?.name || 'Unknown')}</td><td>${esc(l.businesses?.category || '—')}</td><td><span class="pill">${esc(l.status)}</span></td><td>${esc(l.assigned_offer || '—')}</td><td>${money(l.value_estimate_kes)}</td></tr>`));
}

async function loadExperiments() {
  const { data, error } = await db.from('experiments').select('*').order('started_at', { ascending: false }).limit(100);
  if (error) throw error;
  document.getElementById('experiment-list').innerHTML = table(['Experiment','Prospects','Replies','Sales','Revenue','Decision'], (data || []).map(x => `<tr><td>${esc(x.name)}</td><td>${x.prospects}</td><td>${x.replies}</td><td>${x.sales}</td><td>${money(x.revenue_kes)}</td><td><span class="pill">${esc(String(x.decision).toUpperCase())}</span></td></tr>`));
}

async function loadAll() {
  await Promise.all([loadOverview(), loadProducts(), loadLeads(), loadExperiments()]);
}

async function enterApp(session) {
  const admin = await verifyAdmin(session.user.id);
  if (!admin) {
    await db.auth.signOut();
    throw new Error('This account is not authorized for NairobiPixel admin.');
  }
  authScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  setConnection('Live', true);
  await loadAll();
}

async function boot() {
  if (!hasConfig) {
    authMessage.textContent = 'Supabase is not connected yet. Add the new NairobiPixel project URL and anon key to config.js.';
    setConnection('Not configured');
    return;
  }
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    try { await enterApp(session); } catch (error) { authMessage.textContent = error.message; }
  } else {
    setConnection('Sign in required');
  }
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!db) return;
  authMessage.textContent = 'Signing in…';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) { authMessage.textContent = error.message; return; }
  try {
    await enterApp(data.session);
    authMessage.textContent = '';
  } catch (err) {
    authMessage.textContent = err.message;
  }
});

logoutBtn.addEventListener('click', async () => {
  await db.auth.signOut();
  appShell.classList.add('hidden');
  authScreen.classList.remove('hidden');
  setConnection('Signed out');
});

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-view]').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.view').forEach(x => x.classList.remove('active'));
  button.classList.add('active');
  document.getElementById(button.dataset.view).classList.add('active');
  document.getElementById('view-title').textContent = button.textContent;
}));

boot();
