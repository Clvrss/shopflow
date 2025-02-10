const productService = require('../../src/services/productService');
const { models, resetDb, seedRoles, createCategory, createProduct, createInventory } = require('../helpers/db');

describe('productService', () => {
  beforeEach(async () => {
    await resetDb();
    await seedRoles();
  });

  it('creates a product with an inventory row', async () => {
    const category = await createCategory();
    const product = await productService.createProduct({
      sku: 'NEW-1',
      name: 'New Product',
      priceCents: 2500,
      categoryId: category.id,
      stock: 7,
    });

    expect(product.sku).toBe('NEW-1');
    const inventory = await models.Inventory.findOne({ where: { productId: product.id } });
    expect(inventory.quantity).toBe(7);
  });

  it('rejects a duplicate SKU', async () => {
    const category = await createCategory();
    await productService.createProduct({ sku: 'DUP-1', name: 'First', priceCents: 1000, categoryId: category.id });
    await expect(
      productService.createProduct({ sku: 'DUP-1', name: 'Second', priceCents: 2000, categoryId: category.id })
    ).rejects.toThrow();
  });

  it('returns updated product data immediately after an update', async () => {
    const category = await createCategory();
    const product = await createProduct(category.id, { sku: 'UPD-1', priceCents: 1000 });
    await createInventory(product.id, 5);

    await productService.getProductById(product.id);
    await productService.updateProduct(product.id, { priceCents: 99999 });

    const fresh = await productService.getProductById(product.id);
    expect(fresh.priceCents).toBe(99999);
  });
});
