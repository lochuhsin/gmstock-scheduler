'use strict';
const async = require('async');
let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  async.series(
    [
      db.createTable.bind(db, 'stocks', {
        symbol: { type: 'string' },
        name: { type: 'string' },
        currency: { type: 'string' },
        exchange: { type: 'string' },
        mic_code: { type: 'string' },
        country: { type: 'string' },
        type: { type: 'string' },
        latest_date: { type: 'string' },
        oldest_date: { type: 'string' },
      }),
      db.createTable.bind(db, 'forexpair', {
        symbol: { type: 'string' },
        currency_group: { type: 'string' },
        currency_base: { type: 'string' },
        currency_quote: { type: 'string' },
        latest_date: { type: 'string' },
        oldest_date: { type: 'string' },
      }),
      db.createTable.bind(db, 'cryptocurrency', {
        symbol: { type: 'string' },
        available_exchange: { type: 'string' },
        currency_base: { type: 'string' },
        currency_quote: { type: 'string' },
        latest_date: { type: 'string' },
        oldest_date: { type: 'string' },
      }),
      db.createTable.bind(db, 'etf', {
        symbol: { type: 'string' },
        name: { type: 'string' },
        currency: { type: 'string' },
        exchange: { type: 'string' },
        mic_code: { type: 'string' },
        country: { type: 'string' },
        latest_date: { type: 'string' },
        oldest_date: { type: 'string' },
      }),
      db.createTable.bind(db, 'indices', {
        symbol: { type: 'string' },
        name: { type: 'string' },
        country: { type: 'string' },
        currency: { type: 'string' },
        latest_date: { type: 'string' },
        oldest_date: { type: 'string' },
      }),
    ],
    callback,
  );
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
