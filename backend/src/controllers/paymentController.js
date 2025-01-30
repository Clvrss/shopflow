const paymentService = require('../services/paymentService');
const orderService = require('../services/orderService');
const { ok } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const charge = asyncHandler(async (req, res) => {
  const order = await orderService.getUserOrder(req.params.orderId);
  const payment = await paymentService.charge({ order, method: req.body.method });
  return ok(res, payment);
});

module.exports = { charge };
