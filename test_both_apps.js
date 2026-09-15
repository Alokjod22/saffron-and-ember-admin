const fs = require('fs');

async function testUrl(name, url) {
  const start = Date.now();
  try {
    const res = await fetch(url);
    const duration = Date.now() - start;
    let contentType = res.headers.get('content-type') || '';
    let body = '';
    let json = null;

    if (contentType.includes('application/json')) {
      json = await res.json();
    } else {
      body = await res.text();
    }

    return {
      name,
      url,
      status: res.status,
      ok: res.ok,
      durationMs: duration,
      isJson: !!json,
      itemCount: json?.items?.length || json?.orders?.length || json?.categories?.length || null,
      title: body ? (body.match(/<title>(.*?)<\/title>/i) || [])[1] : null,
    };
  } catch (err) {
    return {
      name,
      url,
      status: 0,
      ok: false,
      error: err.message,
    };
  }
}

async function runTests() {
  const endpoints = [
    { name: 'Customer Homepage', url: 'https://saffron-and-ember-web.onrender.com/' },
    { name: 'Customer Menu Page', url: 'https://saffron-and-ember-web.onrender.com/menu' },
    { name: 'Customer API - Menu Items', url: 'https://saffron-and-ember-web.onrender.com/api/menu' },
    { name: 'Customer API - Categories', url: 'https://saffron-and-ember-web.onrender.com/api/categories' },
    { name: 'Customer API - Orders', url: 'https://saffron-and-ember-web.onrender.com/api/orders' },

    { name: 'Admin Dashboard', url: 'https://saffron-and-ember-admin.onrender.com/' },
    { name: 'Admin Menu Management', url: 'https://saffron-and-ember-admin.onrender.com/menu' },
    { name: 'Admin Live Orders', url: 'https://saffron-and-ember-admin.onrender.com/orders' },
    { name: 'Admin Table Reservations', url: 'https://saffron-and-ember-admin.onrender.com/reservations' },
    { name: 'Admin API - Menu Items', url: 'https://saffron-and-ember-admin.onrender.com/api/menu' },
    { name: 'Admin API - Orders', url: 'https://saffron-and-ember-admin.onrender.com/api/orders' },
    { name: 'Admin API - Reservations', url: 'https://saffron-and-ember-admin.onrender.com/api/reservations' },
  ];

  const results = [];
  for (const ep of endpoints) {
    const res = await testUrl(ep.name, ep.url);
    results.push(res);
  }

  fs.writeFileSync('C:/Users/Ritu Chaudhary/.gemini/antigravity/scratch/saffron-and-ember-admin/test_report.json', JSON.stringify(results, null, 2));
}

runTests();
