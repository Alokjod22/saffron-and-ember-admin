const fs = require('fs');

async function testE2E() {
  const logLines = [];
  function log(...args) {
    console.log(...args);
    logLines.push(args.join(' '));
  }

  log("=== E2E INTEGRATION TEST RESULT ===");
  log("1. Placing test order on Customer Web App...");
  
  const menuRes = await fetch('https://saffron-and-ember-web.onrender.com/api/menu');
  const menuData = await menuRes.json();
  const firstItem = menuData.items[0];
  log(`Using Menu Item: ${firstItem.name} (ID: ${firstItem.id}, Price: ₹${firstItem.price})`);

  const orderPayload = {
    customerName: 'Ritu Chaudhary Verification',
    customerEmail: 'ritu@example.com',
    customerPhone: '+91 98765 43210',
    deliveryAddress: 'Penthouse 4B, Saffron Towers, Cyber City',
    orderType: 'DELIVERY',
    total: firstItem.price * 2,
    orderItems: [
      {
        menuItemId: firstItem.id,
        quantity: 2,
        price: firstItem.price,
      },
    ],
  };

  const createRes = await fetch('https://saffron-and-ember-web.onrender.com/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });

  const createData = await createRes.json();
  const newOrderId = createData.order?.id || createData.id;
  log(`Customer Order Response HTTP Status: ${createRes.status}`);
  log(`Created Order ID: ${newOrderId}`);

  log("\n2. Querying Owner Admin Portal Live Orders API...");
  const adminOrdersRes = await fetch('https://saffron-and-ember-admin.onrender.com/api/orders');
  const adminOrdersData = await adminOrdersRes.json();

  const foundOrder = adminOrdersData.orders?.find((o) => o.id === newOrderId);

  if (foundOrder) {
    log("✅ SUCCESS! Real-time Database Synchronization VERIFIED!");
    log(`Order #${foundOrder.id.slice(-6).toUpperCase()} received on Admin Portal with status: ${foundOrder.status}`);
  } else {
    log(`Total orders on Admin Portal: ${adminOrdersData.orders?.length}`);
    log(`Recent order IDs: ${adminOrdersData.orders?.slice(0, 3).map(o => o.id).join(', ')}`);
  }

  fs.writeFileSync('C:/Users/Ritu Chaudhary/.gemini/antigravity/scratch/saffron-and-ember-admin/e2e_output.txt', logLines.join('\n'));
}

testE2E().catch((err) => {
  fs.writeFileSync('C:/Users/Ritu Chaudhary/.gemini/antigravity/scratch/saffron-and-ember-admin/e2e_output.txt', 'Error: ' + err.stack);
});
