const authService = require('../services/authService');
const { ok, created } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const user = await authService.register({ email, firstName, lastName, password });
  return created(res, user);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return ok(res, result);
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  return ok(res, result);
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.body.refreshToken);
  return ok(res, result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword({ email: req.body.email });
  return ok(res, { ok: true });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  return ok(res, { ok: true });
});

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword };
