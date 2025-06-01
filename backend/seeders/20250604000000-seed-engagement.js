'use strict';

const { models } = require('../src/models');

module.exports = {
  up: async () => {
    const jordan = await models.User.findOne({ where: { email: 'customer@shopflow.test' } });
    const sam = await models.User.findOne({ where: { email: 'sam@example.com' } });
    const tara = await models.User.findOne({ where: { email: 'tara@example.com' } });
    const leo = await models.User.findOne({ where: { email: 'leo@example.com' } });
    const admin = await models.User.findOne({ where: { email: 'admin@shopflow.test' } });
    const staff = await models.User.findOne({ where: { email: 'staff@shopflow.test' } });
    const dormant = await models.User.findOne({ where: { email: 'dormant@example.com' } });

    const bySku = async (sku) => models.Product.findOne({ where: { sku } });
    const mouse = await bySku('ELEC-1001');
    const yogaMat = await bySku('FIT-4001');
    const tent = await bySku('OUT-5001');
    const ssd = await bySku('ELEC-1006');
    const skillet = await bySku('HOME-3003');
    const backpack = await bySku('OUT-5002');
    const dumbbell = await bySku('FIT-4002');

    const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

    const reviews = [
      { productId: mouse.id, userId: jordan.id, rating: 5, title: 'Perfect daily driver', body: 'Silent clicks and battery lasts weeks.', isVerifiedPurchase: true, status: 'approved', createdAt: daysAgo(30) },
      { productId: mouse.id, userId: sam.id, rating: 4, title: 'Great value', body: 'Tracks well on glass, pairing is easy.', isVerifiedPurchase: true, status: 'approved', createdAt: daysAgo(25) },
      { productId: mouse.id, userId: tara.id, rating: 5, title: 'Love it', body: 'Small enough to travel with.', isVerifiedPurchase: false, status: 'approved', createdAt: daysAgo(6) },
      { productId: yogaMat.id, userId: jordan.id, rating: 5, title: 'Grippy', body: 'No slipping even in hot yoga.', isVerifiedPurchase: true, status: 'approved', createdAt: daysAgo(18) },
      { productId: yogaMat.id, userId: leo.id, rating: 4, title: 'Solid mat', body: 'A bit heavier than expected but fine.', isVerifiedPurchase: false, status: 'approved', createdAt: daysAgo(10) },
      { productId: yogaMat.id, userId: tara.id, rating: 5, title: 'Pending review', body: 'Waiting for moderation to approve this one.', isVerifiedPurchase: true, status: 'pending', createdAt: daysAgo(1) },
      { productId: tent.id, userId: sam.id, rating: 5, title: 'Two-minute setup', body: 'Withstood a windy night at 9000 ft.', isVerifiedPurchase: true, status: 'approved', createdAt: daysAgo(40) },
      { productId: tent.id, userId: jordan.id, rating: 4, title: 'Good tent', body: 'Roomier than expected for two people.', isVerifiedPurchase: false, status: 'approved', createdAt: daysAgo(35) },
      { productId: tent.id, userId: leo.id, rating: 2, title: 'Not for me', body: 'Zippers stuck after first use.', isVerifiedPurchase: false, status: 'rejected', createdAt: daysAgo(20) },
    ];
    await models.Review.bulkCreate(reviews, { individualHooks: true });

    const inDays = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

    const coupons = [
      { code: 'WELCOME10', description: '10% off your first order', discountType: 'percent', discountValue: 10, minSubtotalCents: 0, maxUses: null, usesCount: 5, expiresAt: inDays(365), isActive: true },
      { code: 'SAVE15', description: '15% off orders over $50', discountType: 'percent', discountValue: 15, minSubtotalCents: 5000, maxUses: 100, usesCount: 12, expiresAt: inDays(30), isActive: true },
      { code: 'FLAT5', description: '$5 off orders over $25', discountType: 'fixed', discountValue: 500, minSubtotalCents: 2500, maxUses: null, usesCount: 3, expiresAt: inDays(45), isActive: true },
      { code: 'EARLYBIRD20', description: '20% off for early birds', discountType: 'percent', discountValue: 20, minSubtotalCents: 0, maxUses: 3, usesCount: 2, expiresAt: inDays(60), isActive: true },
      { code: 'EXPIRED25', description: '25% off - campaign already over', discountType: 'percent', discountValue: 25, minSubtotalCents: 0, maxUses: null, usesCount: 40, expiresAt: daysAgo(15), isActive: true },
    ];
    await models.Coupon.bulkCreate(coupons, { individualHooks: true });

    const notifications = [
      { userId: jordan.id, type: 'order_shipped', title: 'Your order has shipped', body: 'Order SF-2025-000001 is on its way.', link: '/orders/SF-2025-000001', isRead: true, readAt: daysAgo(11), createdAt: daysAgo(11) },
      { userId: jordan.id, type: 'promo', title: 'Spring sale is live', body: 'Up to 40% off outdoor gear this week.', link: '/products', isRead: false, readAt: null, createdAt: daysAgo(2) },
      { userId: jordan.id, type: 'welcome', title: 'Welcome to ShopFlow', body: 'Thanks for joining. Enjoy 10% off with code WELCOME10.', link: '/products', isRead: false, readAt: null, createdAt: daysAgo(60) },
      { userId: sam.id, type: 'order_shipped', title: 'Your order has shipped', body: 'Order SF-2025-000005 is on its way.', link: '/orders/SF-2025-000005', isRead: false, readAt: null, createdAt: daysAgo(2) },
    ];
    await models.Notification.bulkCreate(notifications, { individualHooks: true });

    const wishlist = [
      { userId: jordan.id, productId: backpack.id, createdAt: daysAgo(14) },
      { userId: jordan.id, productId: ssd.id, createdAt: daysAgo(5) },
      { userId: sam.id, productId: dumbbell.id, createdAt: daysAgo(8) },
    ];
    await models.WishlistItem.bulkCreate(wishlist, { individualHooks: true });

    const auditLogs = [
      { actorUserId: admin.id, action: 'product.create', entityType: 'Product', entityId: ssd.id, before: null, after: { sku: 'ELEC-1006', priceCents: 11999 }, ip: '10.0.4.12', createdAt: daysAgo(21) },
      { actorUserId: staff.id, action: 'product.update', entityType: 'Product', entityId: skillet.id, before: { priceCents: 3999 }, after: { priceCents: 3499 }, ip: '10.0.4.18', createdAt: daysAgo(13) },
      { actorUserId: admin.id, action: 'user.disable', entityType: 'User', entityId: dormant.id, before: { status: 'active' }, after: { status: 'disabled' }, ip: '10.0.4.12', createdAt: daysAgo(7) },
    ];
    await models.AuditLog.bulkCreate(auditLogs, { individualHooks: true });
  },

  down: async () => {
    await models.AuditLog.destroy({ where: {}, force: true });
    await models.WishlistItem.destroy({ where: {}, force: true });
    await models.Notification.destroy({ where: {}, force: true });
    await models.Coupon.destroy({ where: {}, force: true });
    await models.Review.destroy({ where: {}, force: true });
  },
};
