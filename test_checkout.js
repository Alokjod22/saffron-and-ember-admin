const fs = require('fs');

async function testCheckout() {
  const payload = {
    customerName: "Alok ord",
    customerPhone: "7248964895",
    customerEmail: "calok5792@gmail.com",
    deliveryAddress: "21 Marine Drive, Apt 4B, Mumbai 400020",
    orderType: "DELIVERY",
    subtotal: 826,
    tax: 41,
    total: 867,
    paymentMethod: "UPI",
    items: [
      {
        menuItemId: "custom-plate-1789461430",
        name: "Custom Perfect Plate (Butter Chicken)",
        quantity: 1,
        price: 826
      }
    ]
  };

  const res = await fetch("https://saffron-and-ember-web.onrender.com/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  fs.writeFileSync('C:/Users/Ritu Chaudhary/.gemini/antigravity/scratch/saffron-and-ember-admin/checkout_res.json', JSON.stringify({ status: res.status, body: text }, null, 2));
}

(async () => {
  await testCheckout();
})();
