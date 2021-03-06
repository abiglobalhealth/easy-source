/**
 * Copyright (c) 2017 Chris Baker <mail.chris.baker@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

'use strict';

var Promise = require('bluebird');

function hasRevision(revision) {
  return function (record) {
    return record.revision === revision;
  };
}

function serialize(revision, version, state) {
  return {
    revision: revision,
    version: JSON.stringify(version),
    state: JSON.stringify(state)
  };
}

function deserialize(record) {
  return {
    revision: record.revision,
    version: JSON.parse(record.version),
    state: JSON.parse(record.state)
  };
}

function negate(f) {
  return function (x) {
    return !f(x);
  };
}

function ProjectionStore() {
  this._records = [];
}

ProjectionStore.prototype = {
  fetch: function (revision) {
    var snapshot = this._records
      .filter(hasRevision(revision))
      .map(deserialize)
      .shift();

    return Promise.resolve(snapshot);
  },

  store: function (revision, version, state) {
    this._records = this._records
      .filter(negate(hasRevision(revision)))
      .concat(serialize(revision, version, state));

    return Promise.resolve();
  }
};

module.exports = ProjectionStore;
