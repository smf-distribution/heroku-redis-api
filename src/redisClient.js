'use strict';

require('dotenv').config();

const {
  REDIS_PASSWORD = '',
  REDIS_URL,
  REDIS_CA = ''
} = process.env;

const
  bluebird = require('bluebird'),
  redis = require('redis');

const redisOptions = () => {

  const options = {
    no_ready_check: true,
    enable_offline_queue: true,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
    }
  };

  if (REDIS_PASSWORD !== '') {
    options.password = REDIS_PASSWORD;
  }
  
  if (REDIS_CA !== '') {
    options.tls = {
      cert: REDIS_CA,
      ca: [ REDIS_CA ]
    };
  }

  if (REDIS_CA !== '') {
    options.tls = {
      cert: REDIS_CA,
      ca: [ REDIS_CA ]
    };
  }

  return options;
};

redis.debug_mode = false;

bluebird.promisifyAll(redis.RedisClient.prototype);

const RedisClient = (() => {
  return redis.createClient(REDIS_URL, redisOptions());
})();

module.exports = RedisClient;
