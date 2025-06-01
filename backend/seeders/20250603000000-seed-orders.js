'use strict';

const { models } = require('../src/models');

function floorTax(subtotalCents) {
  return Math.floor(subtotalCents * 0.0825);
}

function shippingFor(subtotalCents) {
  return subtotalCents >= 5000 ? 0 : 599;
}

async function findVariant(sku) {
  const variant = await models.ProductVariant.findOne({ where: { sku } });
  if (!variant) {
    throw new Error(`Variant not found for seed order: ${sku}`);
  }
  return variant;
}

async function findProduct(sku) {
  const product = await models.Product.findOne({ where: { sku } });
  if (!product) {
    throw new Error(`Product not found for seed order: ${sku}`);
  }
  return product;
}

module.exports = {
  up: async () => {
    const jordan = await models.User.findOne({ where: { email: 'customer@shopflow.test' } });
    const sam = await models.User.findOne({ where: { email: 'sam@example.com' } });
    const tara = await models.User.findOne({ where: { email: 'tara@example.com' } });

    const jordanHome = await models.Address.findOne({ where: { userId: jordan.id, isDefault: true } });
    const samHome = await models.Address.findOne({ where: { userId: sam.id, isDefault: true } });
    const taraHome = await models.Address.findOne({ where: { userId: tara.id, isDefault: true } });

    const headphones = await findVariant('AUD-2001-BLK');
    const bottle = await findVariant('HOME-3004-CHR');
    const yogaMat = await findProduct('FIT-4001');
    const bands = await findProduct('FIT-4003');
    const usbHub = await findProduct('ELEC-1004');
    const monitor = await findProduct('ELEC-1003');
    const tent = await findProduct('OUT-5001');
    const hammock = await findProduct('OUT-5004');

    const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

    const orders = [
      {
        orderNumber: 'SF-2025-000001',
        user: jordan,
        address: jordanHome,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentStatusRow: 'succeeded',
        transactionId: 'sim_txn_0001',
        createdAt: daysAgo(12),
        items: [
          { variant: headphones, product: await headphones.getProduct(), quantity: 1 },
          { variant: bottle, product: await bottle.getProduct(), quantity: 2 },
        ],
      },
      {
        orderNumber: 'SF-2025-000002',
        user: jordan,
        address: jordanHome,
        status: 'pending',
        paymentStatus: 'pending',
        paymentStatusRow: 'pending',
        transactionId: null,
        createdAt: new Date(),
        items: [
          { variant: null, product: yogaMat, quantity: 1 },
          { variant: null, product: bands, quantity: 2 },
        ],
      },
      {
        orderNumber: 'SF-2025-000003',
        user: jordan,
        address: jordanHome,
        status: 'cancelled',
        paymentStatus: 'failed',
        paymentStatusRow: 'failed',
        transactionId: null,
        createdAt: daysAgo(9),
        items: [{ variant: null, product: usbHub, quantity: 1 }],
      },
      {
        orderNumber: 'SF-2025-000004',
        user: tara,
        address: taraHome,
        status: 'refunded',
        paymentStatus: 'refunded',
        paymentStatusRow: 'refunded',
        transactionId: 'sim_txn_0004',
        createdAt: daysAgo(20),
        items: [{ variant: null, product: monitor, quantity: 1 }],
      },
      {
        orderNumber: 'SF-2025-000005',
        user: sam,
        address: samHome,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentStatusRow: 'succeeded',
        transactionId: 'sim_txn_0005',
        createdAt: daysAgo(3),
        items: [
          { variant: null, product: tent, quantity: 1 },
          { variant: null, product: hammock, quantity: 1 },
        ],
      },
    ];

    for (const spec of orders) {
      const subtotal = spec.items.reduce(
        (sum, it) => sum + (it.variant?.priceCents ?? it.product.priceCents) * it.quantity,
        0
      );
      const shipping = shippingFor(subtotal);
      const tax = floorTax(subtotal);
      const total = subtotal + shipping + tax;

      const order = await models.Order.create({
        orderNumber: spec.orderNumber,
        userId: spec.user.id,
        addressId: spec.address.id,
        subtotalCents: subtotal,
        shippingCents: shipping,
        taxCents: tax,
        discountCents: 0,
        totalCents: total,
        currency: 'USD',
        status: spec.status,
        paymentStatus: spec.paymentStatus,
        createdAt: spec.createdAt,
        updatedAt: spec.createdAt,
      });

      for (const it of spec.items) {
        const unitPrice = it.variant ? it.variant.priceCents : it.product.priceCents;
        await models.OrderItem.create({
          orderId: order.id,
          productId: it.product.id,
          variantId: it.variant ? it.variant.id : null,
          productName: it.product.name,
          sku: it.variant ? it.variant.sku : it.product.sku,
          unitPriceCents: unitPrice,
          quantity: it.quantity,
          totalCents: unitPrice * it.quantity,
        });
      }

      await models.Payment.create({
        orderId: order.id,
        amountCents: total,
        method: 'card',
        gateway: 'simulated',
        status: spec.paymentStatusRow,
        transactionId: spec.transactionId,
      });
    }
  },

  down: async () => {
    await models.Payment.destroy({ where: {}, force: true });
    await models.OrderItem.destroy({ where: {}, force: true });
    await models.Order.destroy({ where: {}, force: true });
  },
};
