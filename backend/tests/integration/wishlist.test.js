const request = require('supertest');
const { app, models, resetDb, seedRoles, createUser, createCategory, createProduct, createInventory, loginAs, auth } = require('../helpers/db');

describe('/api/v1/wishlist', () => {
  beforeEach(async () => {
    await resetDb();
    await seedRoles();
  });

  it('adds and lists wishlist items', async () => {
    const user = await createUser();
    const token = await loginAs(user.email);
    const category = await createCategory();
    const product = await createProduct(category.id, { sku: 'W-1' });

    const add = await request(app).post(`/api/v1/wishlist/${product.id}`).set(auth(token));
    expect(add.status).toBe(201);

    const list = await request(app).get('/api/v1/wishlist').set(auth(token));
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBe(1);
    expect(list.body.data[0].product.id).toBe(product.id);
  });

  it('removes a wishlist item', async () => {
    const user = await createUser();
    const token = await loginAs(user.email);
    const category = await createCategory();
    const product = await createProduct(category.id, { sku: 'W-2' });

    await request(app).post(`/api/v1/wishlist/${product.id}`).set(auth(token));

    const del = await request(app).delete(`/api/v1/wishlist/${product.id}`).set(auth(token));
    expect(del.status).toBe(204);

    const list = await request(app).get('/api/v1/wishlist').set(auth(token));
    expect(list.body.data.length).toBe(0);
  });

  it('does not leak wishlist items across users', async () => {
    const alice = await createUser({ email: 'alice-w@example.com' });
    const bob = await createUser({ email: 'bob-w@example.com' });
    const aliceToken = await loginAs(alice.email);
    const bobToken = await loginAs(bob.email);

    const category = await createCategory();
    const product = await createProduct(category.id, { sku: 'W-3' });
    await request(app).post(`/api/v1/wishlist/${product.id}`).set(auth(aliceToken));

    const bobList = await request(app).get('/api/v1/wishlist').set(auth(bobToken));
    expect(bobList.body.data.length).toBe(0);
  });
});
