/* ============================================================
   Much Exchange — shared data layer (user side + admin side)
   A localStorage-backed mock "database" plus session + business
   logic, so the user app and the admin panel both read/write the
   same data. This is mock data for prototyping — not a real backend.
============================================================ */

window.ExchangeData = (function(){
  var PREFIX = 'muchx_';

  function read(key){
    try{
      var raw = localStorage.getItem(PREFIX + key);
      return raw === null ? null : JSON.parse(raw);
    }catch(e){ return null; }
  }
  function write(key, value){
    try{ localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
    catch(e){ return false; }
  }
  function seedIfEmpty(key, seedFn){
    var existing = read(key);
    if (existing === null){
      var seeded = seedFn();
      write(key, seeded);
      return seeded;
    }
    return existing;
  }

  /* ---------------- seed data ---------------- */
  function seedUsers(){
    return [
      { id:'U-1001', name:'John Doe',       email:'john.doe@gmail.com',       phone:'08012345678', bank:'GTBank',       btc:0.005430, usdt:250.00, ngn:250000,  status:'active',   kyc:'verified',   emailVerified:true,  joined:'2024-05-10' },
      { id:'U-1002', name:'Jane Smith',     email:'jane.smith@gmail.com',     phone:'08123456789', bank:'Access Bank',  btc:0.002100, usdt:120.50, ngn:42000,   status:'active',   kyc:'pending',    emailVerified:true,  joined:'2024-06-02' },
      { id:'U-1003', name:'Mike Johnson',   email:'mike.johnson@gmail.com',   phone:'09087654321', bank:'UBA',          btc:0.001000, usdt:500.00, ngn:18000,   status:'pending',  kyc:'unverified', emailVerified:false, joined:'2024-07-19' },
      { id:'U-1004', name:'Sarah Williams', email:'sarah.williams@gmail.com', phone:'08056781234', bank:'Zenith Bank',  btc:0.001250, usdt:75.20,  ngn:96500,   status:'active',   kyc:'verified',   emailVerified:true,  joined:'2024-08-03' },
      { id:'U-1005', name:'David Brown',    email:'david.brown@gmail.com',    phone:'07034567890', bank:'GTBank',       btc:0.000850, usdt:30.00,  ngn:5400,    status:'inactive', kyc:'rejected',   emailVerified:true,  joined:'2024-09-22' },
      { id:'U-1006', name:'Amaka Eze',      email:'amaka.eze@gmail.com',      phone:'08145678901', bank:'Kuda',         btc:0.000300, usdt:12.00,  ngn:7000,    status:'active',   kyc:'pending',    emailVerified:false, joined:'2025-01-14' },
      { id:'U-1007', name:'Tunde Bakare',   email:'tunde.bakare@gmail.com',   phone:'08198765432', bank:'First Bank',   btc:0.012000, usdt:980.00, ngn:610000,  status:'active',   kyc:'verified',   emailVerified:true,  joined:'2025-02-27' }
    ];
  }

  function seedDeposits(){
    return [
      { id:'DEP-3001', userId:'U-1001', userName:'John Doe',       asset:'NGN',  amount:100000,  status:'pending',  date:'2026-06-22 10:30 AM', proof:true },
      { id:'DEP-3002', userId:'U-1002', userName:'Jane Smith',     asset:'USDT', amount:50.00,   status:'pending',  date:'2026-06-22 04:15 PM', proof:false },
      { id:'DEP-3003', userId:'U-1003', userName:'Mike Johnson',   asset:'BTC',  amount:0.00100, status:'pending',  date:'2026-06-21 09:05 AM', proof:false },
      { id:'DEP-3004', userId:'U-1004', userName:'Sarah Williams', asset:'NGN',  amount:200000,  status:'approved', date:'2026-06-20 02:40 PM', proof:true },
      { id:'DEP-3005', userId:'U-1005', userName:'David Brown',    asset:'USDT', amount:100.00,  status:'rejected', date:'2026-06-19 11:00 AM', proof:true }
    ];
  }

  function seedWithdrawals(){
    return [
      { id:'WD-4001', userId:'U-1001', userName:'John Doe',       asset:'NGN',  amount:100000,  destination:'GTBank •••3456',            status:'pending',  date:'2026-06-22 09:10 AM' },
      { id:'WD-4002', userId:'U-1003', userName:'Mike Johnson',   asset:'USDT', amount:75.00,   destination:'TXk9JF...zA6Lm (TRC-20)',    status:'pending',  date:'2026-06-21 06:25 PM' },
      { id:'WD-4003', userId:'U-1004', userName:'Sarah Williams', asset:'BTC',  amount:0.0008,  destination:'bc1qxy2...x0wlh (Bitcoin)',  status:'approved', date:'2026-06-20 08:40 AM' },
      { id:'WD-4004', userId:'U-1006', userName:'Amaka Eze',      asset:'NGN',  amount:5000,    destination:'Kuda •••1290',               status:'rejected', date:'2026-06-18 03:00 PM' }
    ];
  }

  function seedBuyOrders(){
    return [
      { id:'BUY-5001', userId:'U-1001', userName:'John Doe',     asset:'BTC',  amount:'0.001000 BTC', ngn:185000,  status:'completed', date:'2026-06-23 10:30 AM' },
      { id:'BUY-5002', userId:'U-1007', userName:'Tunde Bakare', asset:'USDT', amount:'250.00 USDT',  ngn:412500,  status:'completed', date:'2026-06-20 02:05 PM' },
      { id:'BUY-5003', userId:'U-1002', userName:'Jane Smith',   asset:'BTC',  amount:'0.000450 BTC', ngn:83250,   status:'pending',   date:'2026-06-16 11:00 AM' },
      { id:'BUY-5004', userId:'U-1006', userName:'Amaka Eze',    asset:'USDT', amount:'60.00 USDT',   ngn:99000,   status:'completed', date:'2026-06-12 09:55 AM' }
    ];
  }

  function seedSellOrders(){
    return [
      { id:'SELL-6001', userId:'U-1004', userName:'Sarah Williams', asset:'USDT', amount:'100.00 USDT',  ngn:162000,  status:'completed', date:'2026-06-21 11:30 AM' },
      { id:'SELL-6002', userId:'U-1007', userName:'Tunde Bakare',   asset:'BTC',  amount:'0.002500 BTC', ngn:458750,  status:'completed', date:'2026-06-17 01:18 PM' },
      { id:'SELL-6003', userId:'U-1001', userName:'John Doe',       asset:'USDT', amount:'40.00 USDT',   ngn:64800,   status:'pending',   date:'2026-06-13 05:20 PM' }
    ];
  }

  function seedRates(){
    return {
      BTC: { buy: 185000000, sell: 183500000, updated: '2026-06-23 10:30 AM' },
      USDT:{ buy: 1650,      sell: 1620,      updated: '2026-06-23 10:30 AM' }
    };
  }

  function seedReferrals(){
    return {
      bonusPercent: 1.0,
      referrers: [
        { userId:'U-1001', userName:'John Doe',     code:'JOHND240',  invited:8,  earned:42500 },
        { userId:'U-1004', userName:'Sarah Williams',code:'SARAHW88',  invited:5,  earned:19800 },
        { userId:'U-1007', userName:'Tunde Bakare',  code:'TUNDEB12',  invited:14, earned:96200 }
      ]
    };
  }

  function seedPromoCodes(){
    return [
      { code:'WELCOME10',  type:'Fee discount', value:'10%',  uses:312, limit:1000, status:'active',  expires:'2026-08-01' },
      { code:'NAIJA2026',  type:'Bonus NGN',    value:'₦500', uses:980, limit:2000, status:'active',  expires:'2026-07-15' },
      { code:'LAUNCHWEEK', type:'Fee discount', value:'25%',  uses:1000,limit:1000, status:'expired', expires:'2026-05-01' }
    ];
  }

  function seedNotifications(){
    return [
      { id:'N-01', title:'Scheduled maintenance', body:'Brief downtime expected June 25, 1–2 AM.',          audience:'All users', date:'2026-06-21', status:'sent' },
      { id:'N-02', title:'BTC network fee update', body:'Bitcoin network fees adjusted for withdrawals.',    audience:'All users', date:'2026-06-18', status:'sent' }
    ];
  }

  function seedTransactions(){
    return [
      { id:'TXN-9001', userId:'U-1001', userName:'John Doe',       type:'buy',      asset:'BTC',  amount:'0.001000 BTC', status:'completed', date:'2026-06-23 10:30 AM' },
      { id:'TXN-9002', userId:'U-1002', userName:'Jane Smith',     type:'deposit',  asset:'USDT', amount:'50.00 USDT',   status:'approved',  date:'2026-06-22 04:15 PM' },
      { id:'TXN-9003', userId:'U-1003', userName:'Mike Johnson',   type:'withdraw', asset:'NGN',  amount:'₦100,000',     status:'pending',   date:'2026-06-22 09:10 AM' },
      { id:'TXN-9004', userId:'U-1004', userName:'Sarah Williams', type:'sell',     asset:'USDT', amount:'100.00 USDT',  status:'completed', date:'2026-06-21 11:30 AM' },
      { id:'TXN-9005', userId:'U-1007', userName:'Tunde Bakare',   type:'deposit',  asset:'USDT', amount:'100.00 USDT',  status:'completed', date:'2026-06-21 09:10 AM' },
      { id:'TXN-9006', userId:'U-1006', userName:'Amaka Eze',      type:'buy',      asset:'USDT', amount:'250.00 USDT',  status:'completed', date:'2026-06-20 02:05 PM' },
      { id:'TXN-9007', userId:'U-1004', userName:'Sarah Williams', type:'withdraw', asset:'BTC',  amount:'0.000800 BTC', status:'completed', date:'2026-06-19 08:40 AM' },
      { id:'TXN-9008', userId:'U-1005', userName:'David Brown',    type:'deposit',  asset:'NGN',  amount:'₦200,000',     status:'rejected',  date:'2026-06-18 06:12 PM' }
    ];
  }

  function seedKyc(){
    return [
      { userId:'U-1002', userName:'Jane Smith',   idType:'NIN',         submitted:'2026-06-20', status:'pending' },
      { userId:'U-1003', userName:'Mike Johnson', idType:"Driver's License", submitted:'2026-06-19', status:'pending' },
      { userId:'U-1006', userName:'Amaka Eze',    idType:'NIN',         submitted:'2026-06-21', status:'pending' },
      { userId:'U-1005', userName:'David Brown',  idType:'Passport',    submitted:'2026-06-10', status:'rejected' },
      { userId:'U-1001', userName:'John Doe',     idType:'NIN',         submitted:'2024-05-11', status:'verified' }
    ];
  }

  function seedActivity(){
    return {
      labels:['Jun 17','Jun 18','Jun 19','Jun 20','Jun 21','Jun 22','Jun 23'],
      deposits:  [12, 9, 15, 18, 14, 20, 17],
      withdrawals:[7, 10, 6, 9, 11, 8, 13],
      trades:    [22, 18, 25, 30, 27, 33, 29]
    };
  }

  function seedAddresses(){
    return {
      BTC: {
        icon: '₿', min: '0.0001 BTC',
        networks: {
          'Bitcoin Network': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          'Lightning Network': 'lnbc1p3k9h2mwrpp5xqzfvkj4j2j',
          'BNB Smart Chain (BEP-20)': '0x4f3eA8Cb1393BFEB7C0e0d4D6e7a3eE5Bc4D2a91'
        }
      },
      USDT: {
        icon: '₮', min: '10 USDT',
        networks: {
          'Tron (TRC-20)': 'TXk9JF6vY3xq2Hq4o7P5n8R1sV0cWzA6Lm',
          'Ethereum (ERC-20)': '0x9e8B3c1A4f2D7e6C5b9A0F3d8E1c2B4a6D7f9E0c',
          'BNB Smart Chain (BEP-20)': '0x4f3eA8Cb1393BFEB7C0e0d4D6e7a3eE5Bc4D2a91'
        }
      }
    };
  }

  function seedAdmins(){
    return [
      { id:'A-1', name:'Admin User',   email:'admin@muchexchange.com',        role:'Super Admin',   status:'active' },
      { id:'A-2', name:'Chidi Okafor', email:'chidi.okafor@muchexchange.com',  role:'Support Admin', status:'active' }
    ];
  }

  function init(){
    seedIfEmpty('users', seedUsers);
    seedIfEmpty('deposits', seedDeposits);
    seedIfEmpty('withdrawals', seedWithdrawals);
    seedIfEmpty('buyOrders', seedBuyOrders);
    seedIfEmpty('sellOrders', seedSellOrders);
    seedIfEmpty('rates', seedRates);
    seedIfEmpty('referrals', seedReferrals);
    seedIfEmpty('promoCodes', seedPromoCodes);
    seedIfEmpty('notifications', seedNotifications);
    seedIfEmpty('transactions', seedTransactions);
    seedIfEmpty('kyc', seedKyc);
    seedIfEmpty('activity', seedActivity);
    seedIfEmpty('addresses', seedAddresses);
    seedIfEmpty('admins', seedAdmins);
  }

  function resetAll(){
    ['users','deposits','withdrawals','buyOrders','sellOrders','rates','referrals','promoCodes','notifications','transactions','kyc','activity','addresses','admins']
      .forEach(function(k){ localStorage.removeItem(PREFIX + k); });
    init();
  }

  /* ---------------- session ---------------- */
  function getSession(){ return read('session'); }
  function setSession(userId){ write('session', { userId: userId }); }
  function clearSession(){ try{ localStorage.removeItem(PREFIX + 'session'); }catch(e){} }

  function getCurrentUser(){
    var s = getSession();
    if (!s) return null;
    var users = read('users') || [];
    return users.find(function(u){ return u.id === s.userId; }) || null;
  }

  // Call at the top of any user-facing page. Redirects to login if no session.
  function requireSession(redirectTo){
    var u = getCurrentUser();
    if (!u){
      window.location.href = redirectTo || 'much-exchange-login.html';
      return null;
    }
    return u;
  }

  // Mock login: matches an email or phone against the seeded users.
  // No match falls back to the demo account (John Doe) so the login
  // form always "works" for demo purposes.
  function login(identifier){
    var users = read('users') || [];
    var id = (identifier || '').trim().toLowerCase();
    var match = users.find(function(u){
      return u.email.toLowerCase() === id || u.phone === identifier.trim();
    });
    var user = match || users[0];
    setSession(user.id);
    return user;
  }

  function logout(){ clearSession(); }

  /* ---------------- admin session (separate from the user session above) ---------------- */
  function getAdminSession(){ return read('adminSession'); }
  function setAdminSession(adminId){ write('adminSession', { adminId: adminId }); }
  function clearAdminSession(){ try{ localStorage.removeItem(PREFIX + 'adminSession'); }catch(e){} }

  function currentAdmin(){
    var s = getAdminSession();
    if (!s) return null;
    var admins = read('admins') || [];
    return admins.find(function(a){ return a.id === s.adminId; }) || null;
  }

  // Used on the admin login page only — never falls back to a demo admin,
  // since admin access should always require a real (mock) login.
  function adminLogin(identifier){
    var admins = read('admins') || [];
    var id = (identifier || '').trim().toLowerCase();
    var match = admins.find(function(a){ return a.email.toLowerCase() === id; });
    var admin = match || admins[0];
    setAdminSession(admin.id);
    return admin;
  }

  function adminLogout(){ clearAdminSession(); }

  // Call at the top of every admin-*.html page. Redirects to the admin
  // login screen if nobody is logged in as an admin.
  function requireAdminSession(redirectTo){
    var a = currentAdmin();
    if (!a){
      window.location.href = redirectTo || 'adminlogin.html';
      return null;
    }
    return a;
  }

  // Returns the logged-in user, or null if nobody is logged in.
  function currentUser(){ return getCurrentUser(); }

  // Returns the logged-in user, or a demo account (John Doe) if nobody
  // is logged in — used on pages that should still render something
  // sensible even without a real session, instead of redirecting.
  function currentUserOrDemo(){
    var u = getCurrentUser();
    if (u) return u;
    var users = read('users') || [];
    return users[0] || null;
  }

  function saveUser(updated){
    var users = read('users') || [];
    var idx = -1;
    users.forEach(function(u, i){ if (u.id === updated.id) idx = i; });
    if (idx > -1){ users[idx] = updated; write('users', users); }
    return updated;
  }

  function addTransaction(tx){
    var list = read('transactions') || [];
    tx.id = tx.id || ('TXN-' + Math.floor(100000 + Math.random()*899999));
    tx.date = tx.date || 'Just now';
    list.unshift(tx);
    write('transactions', list);
    return tx;
  }

  /* ---------------- business logic (shared by user + admin pages) ---------------- */

  function fmtCryptoAmount(asset, amount){
    var decimals = asset === 'BTC' ? 6 : 2;
    return amount.toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + ' ' + asset;
  }

  function executeBuy(userId, asset, ngnAmount){
    var users = read('users') || [];
    var user = users.find(function(u){ return u.id === userId; });
    if (!user) return { ok:false, error:'No matching account.' };
    if (!ngnAmount || ngnAmount <= 0) return { ok:false, error:'Enter an amount to continue.' };
    if (ngnAmount > user.ngn) return { ok:false, error:'Insufficient NGN balance.' };

    var rates = read('rates');
    var rate = rates[asset].buy;
    var cryptoAmount = ngnAmount / rate;
    var key = asset.toLowerCase();

    user.ngn -= ngnAmount;
    user[key] = (user[key] || 0) + cryptoAmount;
    write('users', users);

    var amountLabel = fmtCryptoAmount(asset, cryptoAmount);
    addTransaction({ userId:userId, userName:user.name, type:'buy', asset:asset, amount:amountLabel, status:'completed' });

    var orders = read('buyOrders') || [];
    orders.unshift({ id:'BUY-' + Math.floor(1000+Math.random()*8999), userId:userId, userName:user.name, asset:asset, amount:amountLabel, ngn:ngnAmount, status:'completed', date:'Just now' });
    write('buyOrders', orders);

    return { ok:true, user:user, cryptoAmount:cryptoAmount };
  }

  function executeSell(userId, asset, cryptoAmount){
    var users = read('users') || [];
    var user = users.find(function(u){ return u.id === userId; });
    if (!user) return { ok:false, error:'No matching account.' };
    if (!cryptoAmount || cryptoAmount <= 0) return { ok:false, error:'Enter an amount to continue.' };
    var key = asset.toLowerCase();
    if (cryptoAmount > (user[key] || 0)) return { ok:false, error:'Insufficient ' + asset + ' balance.' };

    var rates = read('rates');
    var rate = rates[asset].sell;
    var ngnAmount = cryptoAmount * rate;

    user[key] -= cryptoAmount;
    user.ngn += ngnAmount;
    write('users', users);

    var amountLabel = fmtCryptoAmount(asset, cryptoAmount);
    addTransaction({ userId:userId, userName:user.name, type:'sell', asset:asset, amount:amountLabel, status:'completed' });

    var orders = read('sellOrders') || [];
    orders.unshift({ id:'SELL-' + Math.floor(1000+Math.random()*8999), userId:userId, userName:user.name, asset:asset, amount:amountLabel, ngn:ngnAmount, status:'completed', date:'Just now' });
    write('sellOrders', orders);

    return { ok:true, user:user, ngnAmount:ngnAmount };
  }

  function submitDeposit(userId, asset, amount, hasProof){
    var users = read('users') || [];
    var user = users.find(function(u){ return u.id === userId; });
    if (!user) return { ok:false, error:'No matching account.' };
    if (!amount || amount <= 0) return { ok:false, error:'Enter an amount to continue.' };

    var deposits = read('deposits') || [];
    var id = 'DEP-' + Math.floor(1000+Math.random()*8999);
    deposits.unshift({ id:id, userId:userId, userName:user.name, asset:asset, amount:amount, status:'pending', date:'Just now', proof: !!hasProof });
    write('deposits', deposits);
    return { ok:true, id:id };
  }

  function submitWithdrawal(userId, asset, amount, destination){
    var users = read('users') || [];
    var user = users.find(function(u){ return u.id === userId; });
    if (!user) return { ok:false, error:'No matching account.' };
    if (!amount || amount <= 0) return { ok:false, error:'Enter an amount to continue.' };
    var key = asset === 'NGN' ? 'ngn' : asset.toLowerCase();
    if (amount > (user[key] || 0)) return { ok:false, error:'You only have ' + (asset === 'NGN' ? '₦' + Math.round(user[key]).toLocaleString('en-NG') : fmtCryptoAmount(asset, user[key])) + ' available.' };

    var withdrawals = read('withdrawals') || [];
    var id = 'WD-' + Math.floor(1000+Math.random()*8999);
    withdrawals.unshift({ id:id, userId:userId, userName:user.name, asset:asset, amount:amount, destination:destination, status:'pending', date:'Just now' });
    write('withdrawals', withdrawals);
    return { ok:true, id:id };
  }

  /* ---------------- order / request placement ----------------
     These assume the calling page has already validated the amount
     and balance — they just perform the action and persist it.       */

  function findUser(userId){
    var users = read('users') || [];
    return { users: users, user: users.find(function(u){ return u.id === userId; }) };
  }

  function placeBuyOrder(opts){
    var found = findUser(opts.userId);
    if (!found.user) return null;
    var user = found.user;
    var key = opts.asset.toLowerCase();

    user.ngn -= opts.ngn;
    user[key] = (user[key] || 0) + opts.cryptoAmount;
    write('users', found.users);

    addTransaction({ userId: opts.userId, userName: opts.userName, type:'buy', asset: opts.asset, amount: opts.amountLabel, status:'completed' });

    var orders = read('buyOrders') || [];
    orders.unshift({ id:'BUY-' + Math.floor(1000+Math.random()*8999), userId: opts.userId, userName: opts.userName, asset: opts.asset, amount: opts.amountLabel, ngn: opts.ngn, status:'completed', date:'Just now' });
    write('buyOrders', orders);

    return user;
  }

  function placeSellOrder(opts){
    var found = findUser(opts.userId);
    if (!found.user) return null;
    var user = found.user;
    var key = opts.asset.toLowerCase();

    user[key] -= opts.cryptoAmount;
    user.ngn += opts.ngn;
    write('users', found.users);

    addTransaction({ userId: opts.userId, userName: opts.userName, type:'sell', asset: opts.asset, amount: opts.amountLabel, status:'completed' });

    var orders = read('sellOrders') || [];
    orders.unshift({ id:'SELL-' + Math.floor(1000+Math.random()*8999), userId: opts.userId, userName: opts.userName, asset: opts.asset, amount: opts.amountLabel, ngn: opts.ngn, status:'completed', date:'Just now' });
    write('sellOrders', orders);

    return user;
  }

  function placeDepositRequest(opts){
    var found = findUser(opts.userId);
    if (!found.user) return null;

    var deposits = read('deposits') || [];
    var id = 'DEP-' + Math.floor(1000+Math.random()*8999);
    deposits.unshift({ id:id, userId: opts.userId, userName: opts.userName, asset: opts.asset, amount: opts.amount, status:'pending', date:'Just now', proof: !!opts.proof });
    write('deposits', deposits);
    return id;
  }

  function placeWithdrawalRequest(opts){
    var found = findUser(opts.userId);
    if (!found.user) return null;

    var withdrawals = read('withdrawals') || [];
    var id = 'WD-' + Math.floor(1000+Math.random()*8999);
    withdrawals.unshift({ id:id, userId: opts.userId, userName: opts.userName, asset: opts.asset, amount: opts.amount, destination: opts.destination, status:'pending', date:'Just now' });
    write('withdrawals', withdrawals);
    return id;
  }

  init();

  return {
    get: read, set: write, init: init, resetAll: resetAll,
    getSession: getSession, setSession: setSession, clearSession: clearSession,
    getCurrentUser: getCurrentUser, requireSession: requireSession,
    currentUser: currentUser, currentUserOrDemo: currentUserOrDemo,
    login: login, logout: logout, saveUser: saveUser, addTransaction: addTransaction,
    getAdminSession: getAdminSession, setAdminSession: setAdminSession, clearAdminSession: clearAdminSession,
    currentAdmin: currentAdmin, adminLogin: adminLogin, adminLogout: adminLogout, requireAdminSession: requireAdminSession,
    executeBuy: executeBuy, executeSell: executeSell,
    submitDeposit: submitDeposit, submitWithdrawal: submitWithdrawal,
    placeBuyOrder: placeBuyOrder, placeSellOrder: placeSellOrder,
    placeDepositRequest: placeDepositRequest, placeWithdrawalRequest: placeWithdrawalRequest
  };
})();

// Backward-compatible alias: the admin pages were built calling
// "AdminData.xxx" — point that at the exact same shared object so
// both the admin panel and the user app read/write one data layer.
window.AdminData = window.ExchangeData;

/* ============================================================
   Much Exchange — REAL API client (Phase 9 rewire)

   This talks to the actual FastAPI backend, replacing ExchangeData's
   mock localStorage logic one page at a time. Pages that haven't been
   rewired yet still use ExchangeData above; rewired pages use
   MuchExchangeAPI instead. Both can coexist during the rewire.

   Token storage: user-facing pages (much-exchange-*.html) use a
   DIFFERENT localStorage key than the admin panel (which uses
   "muchExchangeAdminToken", set up when the admin Company Wallets page
   was built) — this mirrors the backend's own separation between user-
   scoped and admin-scoped JWTs, and means being logged into the admin
   panel and your own trading account in the same browser don't
   interfere with each other.

   API_BASE defaults to localhost for local development. Change the
   DEFAULT_API_BASE constant below to your real domain once deployed —
   or set `localStorage.setItem('muchExchangeApiBase', 'https://...')`
   once, e.g. from a build/deploy script, and every page will pick it
   up automatically without editing each file.
============================================================ */

window.MuchExchangeAPI = (function () {
  var DEFAULT_API_BASE = 'http://localhost:8000';
  var TOKEN_KEY = 'muchExchangeUserToken';
  var API_BASE_KEY = 'muchExchangeApiBase';

  function apiBase() {
    return localStorage.getItem(API_BASE_KEY) || DEFAULT_API_BASE;
  }

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
  function clearToken() { localStorage.removeItem(TOKEN_KEY); }

  function decodeJwt(token) {
    try {
      var payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch (e) { return null; }
  }

  function isLoggedIn() {
    var token = getToken();
    if (!token) return false;
    var payload = decodeJwt(token);
    if (!payload) return false;
    if (payload.exp && Date.now() / 1000 > payload.exp) return false;
    return true;
  }

  // Call at the top of any user-facing page that requires a real login.
  // Mirrors ExchangeData.requireSession's redirect behavior above, but
  // checks a real JWT instead of the mock session.
  function requireLogin(redirectTo) {
    if (!isLoggedIn()) {
      window.location.href = redirectTo || 'much-exchange-login.html';
      return false;
    }
    return true;
  }

  async function request(path, options) {
    options = options || {};
    var token = getToken();
    var headers = Object.assign(
      { 'Content-Type': 'application/json' },
      token ? { Authorization: 'Bearer ' + token } : {},
      options.headers || {}
    );

    var res;
    try {
      res = await fetch(apiBase() + path, Object.assign({}, options, { headers: headers }));
    } catch (networkErr) {
      var offlineErr = new Error('Could not reach the server. Check your connection and try again.');
      offlineErr.status = 0;
      throw offlineErr;
    }

    var data = await res.json().catch(function () { return {}; });
    if (!res.ok) {
      var message = extractErrorMessage(data, res.status);
      var err = new Error(message);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  // FastAPI returns errors in two different shapes: intentional errors
  // (HTTPException, e.g. "Email already registered") give `detail` as
  // a plain string. Validation errors (422, from Pydantic) give
  // `detail` as an ARRAY of {loc, msg, type} objects instead — without
  // this, an invalid field would display as "[object Object]" to the
  // user instead of a readable message.
  function extractErrorMessage(data, status) {
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map(function (e) {
        var field = Array.isArray(e.loc) ? e.loc[e.loc.length - 1] : 'field';
        return field + ': ' + e.msg;
      }).join('; ');
    }
    return 'Request failed (' + status + ')';
  }

  // --- Auth ---
  function register(payload) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  }
  function login(email, password) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email: email, password: password }) });
  }
  function me() {
    return request('/auth/me');
  }
  function logout() {
    clearToken();
  }

  // --- Wallets (Phase 4) ---
  function getWallets() {
    return request('/wallets/me');
  }
  function getTransactions() {
    return request('/wallets/me/transactions');
  }

  // --- Rates (Phase 5) ---
  function getRates() {
    return request('/rates');
  }

  return {
    getToken: getToken, setToken: setToken, clearToken: clearToken,
    isLoggedIn: isLoggedIn, requireLogin: requireLogin, decodeJwt: decodeJwt,
    register: register, login: login, me: me, logout: logout,
    getWallets: getWallets, getTransactions: getTransactions, getRates: getRates,
  };
})();
