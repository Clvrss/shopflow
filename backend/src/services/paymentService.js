const crypto = require('crypto');
const { models } = require('../models');
const ApiError = require('../utils/ApiError');

async function charge({ order, method = 'card' }) {
  if (!['card', 'paypal', 'bank_transfer', 'klarna'].includes(method)) {
    throw ApiError.badRequest(`Unsupported payment method: ${method}`);
  }
  if (order.currency !== 'USD') {
    throw ApiError.notImplemented(`Payments in ${order.currency} are not supported yet`);
  }

  // Simulated gateway: every charge succeeds. Swap with a real provider later.
  const transactionId = `sim_${crypto.randomBytes(8).toString('hex')}`;

  const payment = await models.Payment.create({
    orderId: order.id,
    amountCents: order.totalCents,
    method,
    gateway: 'simulated',
    status: 'succeeded',
    transactionId,
  });

  order.paymentStatus = 'paid';
  order.status = 'paid';
  await order.save();

  return payment;
}

module.exports = { charge };
