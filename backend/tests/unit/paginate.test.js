const { buildPagination, buildMeta } = require('../../src/utils/paginate');

describe('buildPagination', () => {
  it('uses defaults when no query is provided', () => {
    expect(buildPagination({})).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it('computes the offset from page and limit', () => {
    expect(buildPagination({ page: '3', limit: '10' })).toEqual({ page: 3, limit: 10, offset: 20 });
  });

  it('caps the limit at the maximum allowed', () => {
    expect(buildPagination({ limit: '999' })).toEqual({ page: 1, limit: 50, offset: 0 });
  });

  it('keeps deep pages addressable', () => {
    expect(buildPagination({ page: '12', limit: '10' })).toEqual({ page: 12, limit: 10, offset: 110 });
  });
});

describe('buildMeta', () => {
  it('reports totals and navigation state', () => {
    expect(buildMeta(42, 1, 10)).toMatchObject({ total: 42, totalPages: 5, hasNextPage: true, hasPrevPage: false });
  });

  it('reports an empty result set', () => {
    expect(buildMeta(0, 1, 10)).toMatchObject({ total: 0, totalPages: 0, hasNextPage: false });
  });
});
