const catalogService = require('../services/catalogService');
const { ok } = require('../utils/response');
const { buildMeta } = require('../utils/paginate');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const categories = await catalogService.listCategories();
  return ok(res, categories);
});

const products = asyncHandler(async (req, res) => {
  const result = await catalogService.listByCategorySlug(req.params.slug, req.query);
  return ok(
    res,
    result.rows,
    buildMeta(result.count, result.page, result.limit)
  );
});

module.exports = { list, products };
