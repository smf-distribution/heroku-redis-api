'use strict';

require('dotenv').config();

const {
    APP_DOMAIN,
    NODE_ENV,
    PUBLIC_DOMAIN,
    WHITELIST_IP = ''
  } = process.env,
  logger = require('heroku-logger'),
  FORWARDED_IP_HEADER = 'x-forwarded-for';

/**
 * Determines if default Heroku app domain is invoked on Production
 *
 * @param {Object} [req] Request object
 * @return {Boolean}
 */
const isAppDomainOnProduction = (req) => {
  return APP_DOMAIN !== '' &&
    PUBLIC_DOMAIN !== '' &&
    req.headers.host === APP_DOMAIN;
};

/**
 * Determines if a non secure url is requested on production
 *
 * @param {Object} [req] Request object
 * @return {Boolean}
 */
const isNonSecurePublicDomainOnProduction = (req) => {
  return PUBLIC_DOMAIN !== '' &&
    req.headers.host === PUBLIC_DOMAIN &&
    req.header('x-forwarded-proto') !== 'https';
};

/**
 * Force using HTTPS on Staging and Production
 *
 * @param {Object} [req] Request object
 * @param {Object} [res] Response object
 * @param {Object} [next] Middleware callback
 */
const forceDomainSSL = (req, res, next) => {
  switch(NODE_ENV) {
  case 'local':
    // @TODO
    next();
    break;
  case 'review':
  case 'staging':
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(302, `https://${req.headers.host}${req.originalUrl}`);
    }
    else {
      return next();
    }
    break;
  case 'production':
    if (isAppDomainOnProduction(req)) {
      res.redirect(302, `https://${PUBLIC_DOMAIN}${req.originalUrl}`);
    }
    else if (isNonSecurePublicDomainOnProduction(req)) {
      logger.info(`Insecure request to ${PUBLIC_DOMAIN}`);
      res.redirect(302, `https://${req.headers.host}${req.originalUrl}`);
    }
    else return next();
    break;
  default:
    return next();
  }
};

/**
 * Exclude route from express middleware
 *
 * You can add as many routes as you wish, e.g.
 *
 * app.use(unless(redirectPage, '/user/login', '/user/register'));
 *
 * @param {Object} middleware
 * @param  {...any} paths
 */
const unless = (middleware, ...paths) => (req, res, next) => {
  const pathCheck = paths.some(path => path === req.path);
  pathCheck ? next() : middleware(req, res, next);
};

const middlewareSecurity = (req, res, next) => {
  res.set('X-XSS-Protection', '1; mode=block');
  return next();
};

/**
 * A middleware to skip HTTP requests for .map files
 * Don't use this method if you actually have sourcemap files for minified files.
 *
 * @param {Object} [req] Request object
 * @param {Object} [res] Response object
 * @param {Object} [next] Middleware callback
 */
const skipMap = (req, res, next) => {
  if (req.path.match(/\.map$/i)) {
    res.send('');
  } else {
    return next();
  }
};

/**
 * Restrict access by IP address/es
 *
 * @param {Object} [req] Request object
 * @param {Object} [res] Response object
 * @param {Object} [next] Middleware callback
 */
const whitelistIp = (req, res, next) => {
  if (WHITELIST_IP === '') {
    return next();
  }
  const request_ip = req.get(FORWARDED_IP_HEADER) || req.ip;
  /* @TODO
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress;
  */
  if (WHITELIST_IP.split(',').includes(request_ip)) {
    return next();
  } else {
    res.status(403).send('Forbidden: Access is denied.');
  }
};

module.exports = {
  isAppDomainOnProduction,
  isNonSecurePublicDomainOnProduction,
  forceDomainSSL,
  unless,
  middlewareSecurity,
  skipMap,
  whitelistIp
};
