const request = require('supertest');
const { app, models, resetDb, seedRoles, createUser, createCategory, createProduct, createInventory, loginAs, auth } = require('../helpers/db');

describe('/api/v1/coupons', () => {
  beforeEach(async () => {
    await resetDb();
    await seedRoles();
  });

  it('validates a valid coupon code', async () => {
    const user = await createUser();
    const token = await loginAs(user.email);
    await models.Coupon.create({
      code: 'TEST10',
      discountType: 'percent',
      discountValue: 10,
      minSubtotalCents: 0,
      isActive: true,
    });

    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .set(auth(token))
      .send({ code: 'test10', subtotalCents: 10000 });

    expect(res.status).toBe(200);
  });

  it('rejects expired coupons', async () => {
    const user = await createUser();
    const token = await loginAs(user.email);
    await models.Coupon.create({
      code: 'OLDBUT',
      discountType: 'percent',
      discountValue: 10,
      minSubtotalCents: 0,
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isActive: true,
    });

    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .set(auth(token))
      .send({ code: 'OLDBUT', subtotalCents: 10000 });

    expect(res.status).toBe(400);
  });

  it('enforces the minimum subtotal', async () => {
    const user = await createUser();
    const token = await loginAs(user.email);
    await models.Coupon.create({
      code: 'MIN100',
      discountType: 'percent',
      discountValue: 10,
      minSubtotalCents: 10000,
      isActive: true,
    });

    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .set(auth(token))
      .send({ code: 'MIN100', subtotalCents: 500 });

    expect(res.status).toBe(400);
  });

  it('rejects a coupon once its usage limit is reached', async () => {
    const user = await createUser();
    const token = await loginAs(user.email);
    const coupon = await models.Coupon.create({
      code: 'LIMIT1',
      discountType: 'percent',
      discountValue: 10,
      minSubtotalCents: 0,
      maxUses: 1,
      usesCount: 0,
      isActive: true,
    });
    const category = await createCategory();
    const product = await createProduct(category.id, { sku: 'CP-2', priceCents: 5000 });
    await createInventory(product.id, 20);
    const address = await models.Address.create({
      userId: user.id,
      firstName: 'A',
      lastName: 'B',
      line1: '1 Main St',
      city: 'Portland',
      country: 'US',
    });

    await request(app).post('/api/v1/cart/items').set(auth(token)).send({ productId: product.id, quantity: 1 });
    const first = await request(app).post('/api/v1/orders').set(auth(token)).send({ addressId: address.id, couponCode: 'LIMIT1' });
    expect(first.status).toBe(201);

    await request(app).post('/api/v1/cart/items').set(auth(token)).send({ productId: product.id, quantity: 1 });
    const second = await request(app).post('/api/v1/orders').set(auth(token)).send({ addressId: address.id, couponCode: 'LIMIT1' });
    expect(second.status).toBe(400);

    const after = await models.Coupon.findByPk(coupon.id);
    expect(after.usesCount).toBe(1);
  });
});
