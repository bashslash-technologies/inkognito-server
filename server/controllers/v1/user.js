"use strict";

const express = require("express");
const authService = require("../../services/v1/user");
const { handleSuccess, resolveUser } = require("../../middlewares");

function init(io) {
  let router = express.Router();

  router.get("/", async function (req, res, next) {
    try {
      let result = await authService.retrieveUsers(req.query);
      handleSuccess(res, result, "login successful");
    } catch (err) {
      next(err);
    }
  });

  router.post("/login", async function (req, res, next) {
    try {
      let result = await authService.loginUser(req.body);
      handleSuccess(res, result, "login successful");
    } catch (err) {
      next(err);
    }
  });

  router.post("/register", async function (req, res, next) {
    try {
      let result = await authService.registerUser(req.body);
      handleSuccess(res, result, "account created successful");
    } catch (err) {
      next(err);
    }
  });

  router.post("/verify", async function (req, res, next) {
    try {
      let result = await authService.verifyUser(req.body);
      handleSuccess(res, result, "account verified successful");
    } catch (err) {
      next(err);
    }
  });

  router.get("/verify", async function (req, res, next) {
    try {
      let result = await authService.sendVerification(req.query);
      handleSuccess(res, result, "verification code sent successful");
    } catch (err) {
      next(err);
    }
  });

  router.post("/reset", async function (req, res, next) {
    try {
      let result = await authService.verifyReset(req.body);
      handleSuccess(res, result, "reset code verified successful");
    } catch (err) {
      next(err);
    }
  });

  router.get("/reset", async function (req, res, next) {
    try {
      let result = await authService.sendReset(req.query);
      handleSuccess(res, result, "reset code sent successful");
    } catch (err) {
      next(err);
    }
  });

  router.post("/password", async function (req, res, next) {
    try {
      let result = await authService.resetPassword(req.body);
      handleSuccess(res, result, "password reset successful");
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = init;
