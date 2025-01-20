function ok(res, data, meta) {
  const body = { data };
  if (meta) body.meta = meta;
  return res.json(body);
}

function created(res, data) {
  return res.status(201).json({ data });
}

function noContent(res) {
  return res.status(204).end();
}

module.exports = { ok, created, noContent };
