const PAGE = "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"theme-color\" content=\"#f7f8fa\"><title>Payment Transparency</title>\n<style>\n:root{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#18202b;background:#f7f8fa}*{box-sizing:border-box}body{margin:0}main{max-width:960px;margin:0 auto;padding:42px 20px}.head{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}.eyebrow{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;font-weight:700}h1{font-size:30px;letter-spacing:-.04em;margin:5px 0}.muted{color:#6b7280;margin:0}.pill{font-size:12px;color:#16794b;background:#eaf6ef;border:1px solid #dce9e0;padding:7px 11px;border-radius:99px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:24px 0}.card,.filter,.panel{background:white;border:1px solid #e7eaf0;border-radius:15px;padding:18px}.label{font-size:13px;color:#6b7280}.value{font-size:28px;font-weight:750;letter-spacing:-.04em;margin-top:8px}.filter{margin-bottom:16px}.filters{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end;margin-top:13px}label{display:block;font-size:12px;color:#6b7280;margin-bottom:5px}input{width:100%;padding:10px;border:1px solid #e0e4eb;border-radius:9px;font:inherit}button{border:0;border-radius:9px;padding:11px 16px;background:#1d2938;color:white;font:inherit;font-weight:650;cursor:pointer}.quick{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.quick button{padding:6px 10px;background:white;color:#394252;border:1px solid #e7eaf0;font-size:12px}.panel{padding:0;overflow:hidden}.panelhead{padding:17px 18px;border-bottom:1px solid #e7eaf0;display:flex;justify-content:space-between;gap:12px}.scroll{overflow:auto}table{width:100%;border-collapse:collapse;min-width:520px}th,td{text-align:left;padding:13px 18px;border-bottom:1px solid #f0f1f4;font-size:13px}th{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em}td:last-child,th:last-child{text-align:right}.ok{color:#16794b;font-weight:650}.notice,.empty{padding:20px;color:#6b7280;text-align:center}.notice{background:#fff8e9;color:#73551e;border:1px solid #f1dfb8;border-radius:12px;margin:16px 0}.foot{text-align:center;color:#6b7280;font-size:12px;margin:16px 0}\n@media(max-width:650px){main{padding:28px 14px}.cards{grid-template-columns:1fr}.value{font-size:24px}.filters{grid-template-columns:1fr 1fr}.filters button{grid-column:1/-1}}\n</style></head><body><main>\n<div class=\"head\"><div><div class=\"eyebrow\">Public collection record</div><h1>Payment transparency</h1><p class=\"muted\">Date-wise view of successful payments received through PayU.</p></div><span class=\"pill\">● Successful payments only</span></div>\n<div id=\"notice\" class=\"notice\" hidden></div>\n<div class=\"cards\"><div class=\"card\"><div class=\"label\">Successfully collected</div><div class=\"value\" id=\"total\">—</div></div><div class=\"card\"><div class=\"label\">Successful payments</div><div class=\"value\" id=\"count\">—</div></div><div class=\"card\"><div class=\"label\">Average payment</div><div class=\"value\" id=\"average\">—</div></div></div>\n<section class=\"filter\"><strong>Filter by date</strong><div class=\"quick\"><button type=\"button\" data-days=\"7\">Last 7 days</button><button type=\"button\" data-days=\"30\">Last 30 days</button><button type=\"button\" data-days=\"month\">This month</button></div><div class=\"filters\"><div><label for=\"from\">From</label><input type=\"date\" id=\"from\"></div><div><label for=\"to\">To</label><input type=\"date\" id=\"to\"></div><button id=\"apply\">Apply filter</button></div></section>\n<section class=\"panel\"><div class=\"panelhead\"><strong>Successful transactions</strong><span id=\"period\" class=\"muted\"></span></div><div class=\"scroll\"><table><thead><tr><th>Date</th><th>Reference</th><th>Mode</th><th>Amount</th></tr></thead><tbody id=\"rows\"></tbody></table></div><div id=\"empty\" class=\"empty\" hidden>No successful payments in this date range.</div></section>\n<p class=\"foot\">Only captured PayU transactions are displayed. Customer contact details and payment credentials are never published.</p>\n</main><script>\nconst el=id=>document.getElementById(id);\nconst today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());\nconst shift=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};\nconst money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);\nconst displayDate=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s||'');if(!m)return s;const d=new Date(Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3])));return new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(d)};\nfunction notice(s){el('notice').textContent=s;el('notice').hidden=false}\nasync function load(){const from=el('from').value,to=el('to').value;if(!from||!to||from>to){notice('Choose a valid date range.');return}el('notice').hidden=true;el('rows').replaceChildren();el('empty').hidden=true;el('apply').disabled=true;el('apply').textContent='Loading…';try{const r=await fetch('/api/public/transactions?from='+encodeURIComponent(from)+'&to='+encodeURIComponent(to));const d=await r.json();if(!r.ok)throw new Error(d.message||'Unable to fetch transactions');el('total').textContent=money(d.summary.totalAmount);el('count').textContent=d.summary.successfulPayments;el('average').textContent=money(d.summary.averageAmount);el('period').textContent=from+' – '+to;d.transactions.forEach(t=>{const tr=document.createElement('tr');[displayDate(t.date),t.reference,t.paymentMode].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});const a=document.createElement('td');a.textContent=money(t.amount);tr.append(a);el('rows').append(tr)});el('empty').hidden=d.transactions.length!==0}catch(e){el('total').textContent='—';el('count').textContent='—';el('average').textContent='—';notice(e.message||'Unable to fetch payment data.')}finally{el('apply').disabled=false;el('apply').textContent='Apply filter'}}\nel('apply').addEventListener('click',load);document.querySelectorAll('[data-days]').forEach(b=>b.addEventListener('click',()=>{const t=today();el('to').value=t;el('from').value=b.dataset.days==='month'?t.slice(0,8)+'01':shift(t,-(Number(b.dataset.days)-1));load()}));\nconst t=today();el('to').value=t;el('from').value=shift(t,-6);load();\n</script></body></html>";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type, Cache-Control, Pragma",
  "Access-Control-Max-Age": "86400"
};
function reply(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: {
    ...CORS, "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff", ...extra
  }});
}
function isDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s || "")) return false;
  const d = new Date(s + "T00:00:00.000Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
function days(s) { return Date.parse(s + "T00:00:00.000Z") / 86400000; }
function base64(buffer) {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary);
}
async function auth(body, date, key, salt) {
  const encoder = new TextEncoder();
  const digest = base64(await crypto.subtle.digest("SHA-256", encoder.encode(body)));
  const signingString = "date: " + date + "\ndigest: " + digest;
  const secretKey = await crypto.subtle.importKey(
    "raw", encoder.encode(salt), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = base64(await crypto.subtle.sign("HMAC", secretKey, encoder.encode(signingString)));
  return {
    digest,
    authorization: 'hmac username="' + key + '", algorithm="hmac-sha256", headers="date digest", signature="' + signature + '"'
  };
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function redactDiagnosticText(value, secrets = []) {
  let text = String(value ?? "");
  for (const secret of secrets) {
    if (secret) text = text.split(String(secret)).join("[redacted]");
  }
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]")
    .replace(/\b\+?\d[\d\s().-]{8,}\d\b/g, "[redacted-number]")
    .replace(/\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi, "Bearer [redacted]")
    .replace(/(authorization|signature|merchant.?key|merchant.?salt|salt|key)(["'\s:=]+)[^,\s"'<>]+/gi, "$1$2[redacted]")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}
function extractPayUErrorDetails(responseText, key, salt) {
  if (!responseText) return { responseBody: "empty" };
  try {
    const payload = JSON.parse(responseText);
    const details = {};
    const fields = [
      "code", "errorCode", "error_code", "message", "msg", "error",
      "errorMessage", "error_description", "description", "statusMessage"
    ];
    const collect = (value, prefix = "") => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return;
      for (const field of fields) {
        if (Object.prototype.hasOwnProperty.call(value, field)) {
          const item = value[field];
          if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
            details[prefix + field] = typeof item === "string"
              ? redactDiagnosticText(item, [key, salt])
              : item;
          }
        }
      }
    };
    collect(payload);
    if (payload.error && typeof payload.error === "object") collect(payload.error, "error.");
    if (payload.data && typeof payload.data === "object") collect(payload.data, "data.");
    if (Array.isArray(payload.errors)) {
      details.errors = payload.errors.slice(0, 3).map(item => {
        const safe = {};
        if (item && typeof item === "object") {
          for (const field of ["code", "message", "description"]) {
            const value = item[field];
            if (typeof value === "string" || typeof value === "number") {
              safe[field] = typeof value === "string" ? redactDiagnosticText(value, [key, salt]) : value;
            }
          }
        }
        return safe;
      });
    }
    return Object.keys(details).length ? details : { responseFormat: "json", fields: Object.keys(payload).slice(0, 12) };
  } catch {
    return { responseFormat: "text", preview: redactDiagnosticText(responseText, [key, salt]) };
  }
}
function payUResponseHeaders(response) {
  const output = {};
  for (const name of ["date", "content-type", "x-request-id", "request-id", "x-correlation-id", "x-trace-id"]) {
    const value = response.headers.get(name);
    if (value) output[name] = value.slice(0, 160);
  }
  return output;
}
function retryDelay(response, attempt) {
  const retryAfter = response?.headers?.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(2000, seconds * 1000);
    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.max(0, Math.min(2000, date - Date.now()));
  }
  return Math.min(1000, 250 * (2 ** (attempt - 1)));
}
function cacheBypassRequested(request, url) {
  if (url.searchParams.get("fresh") === "1") return true;
  const directives = (request.headers.get("cache-control") || "")
    .toLowerCase().split(",").map(value => value.trim());
  const pragma = (request.headers.get("pragma") || "").toLowerCase();
  return directives.some(value => value === "no-cache" || value === "no-store" || value === "max-age=0")
    || pragma.split(",").some(value => value.trim() === "no-cache");
}
function noStore(response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
function publicContributorName(firstValue, lastValue) {
  const clean = value => String(value || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const first = clean(firstValue).split(" ")[0].slice(0, 40);
  const last = clean(lastValue).split(" ")[0].slice(0, 40);
  const generic = /^(anonymous|guest|unknown|test|payu-admin|n\/?a|na)$/i;
  if (!first || generic.test(first)) return "Anonymous contributor";
  const initial = last && !generic.test(last) ? " " + Array.from(last)[0].toUpperCase() + "." : "";
  return first + initial;
}
async function getPage(pageNumber, from, to, key, salt) {
  const body = JSON.stringify({ pageNumber, startDate: from, endDate: to, totalRecord: 50 });
  const date = new Date().toUTCString();
  const authentication = await auth(body, date, key, salt);
  const requestOptions = {
    method: "POST",
    headers: {
      "Accept": "application/json", "Content-Type": "application/json",
      "Date": date, "Digest": authentication.digest, "Authorization": authentication.authorization
    },
    body
  };
  let response = null;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      response = await fetch("https://info.payu.in/v4/reporting/transactions", requestOptions);
    } catch (error) {
      if (attempt < maxAttempts) {
        console.warn(JSON.stringify({
          message: "PayU reporting network attempt failed; retrying",
          page: pageNumber, attempt, maxAttempts
        }));
        await sleep(retryDelay(null, attempt));
        continue;
      }
      console.error(JSON.stringify({
        message: "PayU reporting network failure",
        page: pageNumber, attempts: attempt,
        error: redactDiagnosticText(error instanceof Error ? error.message : "Network error", [key, salt])
      }));
      const failure = new Error("Unable to reach PayU reporting service after retrying. Please try again shortly.");
      failure.code = "PAYU_NETWORK_ERROR";
      throw failure;
    }

    if (response.ok) break;
    const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
    if (retryable && attempt < maxAttempts) {
      console.warn(JSON.stringify({
        message: "PayU reporting returned a retryable status",
        status: response.status, page: pageNumber, attempt, maxAttempts
      }));
      await response.body?.cancel();
      await sleep(retryDelay(response, attempt));
      continue;
    }

    const responseText = await response.text();
    console.error(JSON.stringify({
      message: "PayU reporting API rejected request",
      status: response.status,
      page: pageNumber,
      attempts: attempt,
      responseHeaders: payUResponseHeaders(response),
      responseDetails: extractPayUErrorDetails(responseText, key, salt)
    }));

    const failure = new Error(
      response.status === 403
        ? "PayU rejected the reporting request (HTTP 403). Verify that Transaction Reporting API access is enabled and that the merchant credentials are authorized."
        : response.status === 401
          ? "PayU authentication failed (HTTP 401). Verify the production merchant Key/Salt pair and configured signing method."
          : response.status === 429
            ? "PayU rate-limited the reporting request. Please retry shortly."
            : "PayU reporting service returned HTTP " + response.status + ". Please retry later or contact PayU support."
    );
    failure.code = response.status === 403 ? "PAYU_FORBIDDEN"
      : response.status === 401 ? "PAYU_UNAUTHORIZED"
      : response.status === 429 ? "PAYU_RATE_LIMITED"
      : response.status >= 500 ? "PAYU_UPSTREAM_ERROR"
      : "PAYU_REQUEST_REJECTED";
    failure.upstreamStatus = response.status;
    throw failure;
  }

  if (!response || !response.ok) {
    const failure = new Error("PayU reporting request failed.");
    failure.code = "PAYU_REPORTING_ERROR";
    throw failure;
  }

  const responseText = await response.text();
  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    console.error(JSON.stringify({
      message: "PayU reporting API returned invalid JSON",
      page: pageNumber,
      responseHeaders: payUResponseHeaders(response),
      responseDetails: extractPayUErrorDetails(responseText, key, salt)
    }));
    const failure = new Error("PayU returned an invalid reporting response.");
    failure.code = "PAYU_INVALID_RESPONSE";
    failure.upstreamStatus = response.status;
    throw failure;
  }
  if (data.status !== 1 || !Array.isArray(data.result)) {
    console.error(JSON.stringify({
      message: "Unexpected PayU reporting response",
      page: pageNumber,
      status: data.status,
      responseDetails: extractPayUErrorDetails(responseText, key, salt)
    }));
    const failure = new Error("PayU returned an unexpected reporting response.");
    failure.code = "PAYU_UNEXPECTED_RESPONSE";
    failure.upstreamStatus = response.status;
    throw failure;
  }
  return data;
}
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (request.method !== "GET") return reply({ message: "Read-only service. Only GET requests are supported." }, 405, { Allow: "GET, OPTIONS" });
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(PAGE, { headers: {
        "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
      }});
    }
    if (url.pathname === "/health") return reply({ service: "payu-transparency", status: "online", mode: "read-only" });
    if (url.pathname !== "/api/public/transactions") return reply({ message: "Not found" }, 404);

    const from = url.searchParams.get("from"), to = url.searchParams.get("to");
    if (!isDate(from) || !isDate(to) || from > to) return reply({ message: "Provide valid from and to dates in YYYY-MM-DD format." }, 400);
    if (days(to) - days(from) > 365) return reply({ message: "Date range is limited to 366 days per request." }, 400);
    if (!env.PAYU_MERCHANT_KEY || !env.PAYU_MERCHANT_SALT) {
      return reply({ message: "PayU is not connected yet. Add PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT as Cloudflare Worker secrets after rotating the exposed Salt." }, 503);
    }

    const cache = caches.default;
    const cacheUrl = new URL(url.origin + url.pathname);
    cacheUrl.searchParams.set("from", from);
    cacheUrl.searchParams.set("to", to);
    const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
    const bypassCache = cacheBypassRequested(request, url);
    if (!bypassCache) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }
    try {
      const all = [];
      let chunkStart = from;
      let totalPagesFetched = 0;
      while (chunkStart <= to) {
        const chunkEnd = days(to) - days(chunkStart) > 30
          ? new Date((days(chunkStart) + 30) * 86400000).toISOString().slice(0, 10)
          : to;
        const first = await getPage(1, chunkStart, chunkEnd, env.PAYU_MERCHANT_KEY, env.PAYU_MERCHANT_SALT);
        const totalPages = Number(first.totalPages || (first.result.length ? 1 : 0));
        if (!Number.isInteger(totalPages) || totalPages < 0 || totalPages > 60) {
          return reply({ message: "Too many transactions in one date segment. Narrow the date range and retry." }, 422);
        }
        all.push(...first.result);
        totalPagesFetched += 1;
        for (let p = 2; p <= totalPages; p++) {
          totalPagesFetched += 1;
          if (totalPagesFetched > 100) return reply({ message: "Too many transactions to display in one request. Narrow the date range." }, 422);
          const next = await getPage(p, chunkStart, chunkEnd, env.PAYU_MERCHANT_KEY, env.PAYU_MERCHANT_SALT);
          all.push(...next.result);
        }
        chunkStart = new Date((days(chunkEnd) + 1) * 86400000).toISOString().slice(0, 10);
      }
      const seen = new Set(), transactions = [];
      for (const item of all) {
        const d = item && item.transactionDetails ? item.transactionDetails : {};
        if (String(d.status || "").toLowerCase() !== "captured") continue;
        const id = String(d.id || item.payuId || "");
        const grossAmount = Number(d.amount);
        const actions = Array.isArray(item.transactionActionDetails) ? item.transactionActionDetails : [];
        const successfulRefunds = actions
          .filter(action =>
            String(action.actionType || "").toLowerCase() === "refund" &&
            String(action.status || "").toLowerCase() === "success"
          )
          .reduce((sum, action) => sum + (Number(action.amount) || 0), 0);
        const amount = Math.round((grossAmount - successfulRefunds) * 100) / 100;
        if (!id || seen.has(id) || !Number.isFinite(amount) || amount <= 0) continue;
        seen.add(id);
        transactions.push({ reference: "PAY-••••" + id.slice(-6), date: String(d.addedOn || d.updatedOn || ""), amount, paymentMode: String(d.mode || "OTHER").toUpperCase(), contributor: publicContributorName(d.firstName, d.lastName) });
      }
      transactions.sort((a,b) => b.date.localeCompare(a.date));
      const totalAmount = Math.round(transactions.reduce((s,t) => s + t.amount, 0) * 100) / 100;
      const count = transactions.length;
      const output = reply({ range: { from, to }, summary: {
        successfulPayments: count, totalAmount, averageAmount: count ? Math.round(totalAmount / count * 100) / 100 : 0, currency: "INR"
      }, transactions, source: "PayU", statusFilter: "captured" }, 200, {
        "Cache-Control": "public, max-age=60, s-maxage=300"
      });
      ctx.waitUntil(cache.put(cacheKey, output.clone()));
      return bypassCache ? noStore(output) : output;
    } catch (error) {
      const code = error && typeof error.code === "string" ? error.code : "PAYU_REPORTING_ERROR";
      const upstreamStatus = error && Number.isInteger(error.upstreamStatus) ? error.upstreamStatus : undefined;
      console.error(JSON.stringify({
        message: "Public transactions request failed",
        code,
        upstreamStatus,
        error: error instanceof Error ? error.message : "Unknown error"
      }));
      return reply({
        message: error instanceof Error ? error.message : "Unable to fetch payment data.",
        code,
        ...(upstreamStatus ? { upstreamStatus } : {})
      }, 502);
    }
  }
};