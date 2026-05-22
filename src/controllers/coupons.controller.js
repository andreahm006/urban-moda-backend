const coupons = [];

async function createCoupon(req, res) {
  const coupon = { id: coupons.length + 1, ...req.body };
  coupons.push(coupon);
  res.status(201).json(coupon);
}

async function getCoupon(req, res) {
  const code = String(req.params.code || '').toUpperCase();
  if (code === 'URBAN10') return res.json({ code: 'URBAN10', type: 'percent', value: 10 });
  const coupon = coupons.find(c => String(c.code).toUpperCase() === code);
  if (!coupon) return res.status(404).json({ message: 'Cupón no encontrado' });
  res.json(coupon);
}

module.exports = { createCoupon, getCoupon };
