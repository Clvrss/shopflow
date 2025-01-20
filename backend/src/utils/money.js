function toDollars(cents) {
  return (cents / 100).toFixed(2);
}

function fromDollars(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}

module.exports = { toDollars, fromDollars };
