if (should === void 0) { var should = require('chai').should(); }
var Bytes = require('../src/bytes');

describe('Parsing', function() {
  describe('#string', function() {
    describe('#Standard (base 1000)', function() {
      it('"1 GB" should be equal to 1000000000 bytes', function() {
        var bytes = new Bytes("1 GB");
        (bytes.bytes()).should.equal(1000000000);
      });
    });
    describe('#Metric (base 1024)', function() {
      it('"1 GiB" should be equal to 1073741824 bytes', function() {
        var bytes = new Bytes("1 GiB");
        (bytes.bytes()).should.equal(1073741824);
      });
    });
    describe('#Optional space between number and prefix', function() {
      it('"1GB" should be equal to 1000000000 bytes', function() {
        var bytes = new Bytes("1GB");
        (bytes.bytes()).should.equal(1000000000);
      });
    });
  });
  describe('#number', function() {
    it('1000 should be equal to 1000 bytes', function() {
      var bytes = new Bytes(1000);
      (bytes.bytes()).should.equal(1000);
    });
  });
});

describe('Conversion', function() {
  describe('#bits to bytes', function() {
    it('"8 b" should be equal to 1 byte', function() {
      var bytes = new Bytes("8 b");
      (bytes.bytes()).should.equal(1);
    });
  });
  describe('#bytes to bits', function() {
    it('1 B should be equal to 8 bits', function() {
      var bytes = new Bytes(1);
      (bytes.bits()).should.equal(8);
    });
  });
});

describe('Humanization', function() {
  describe('#small value', function() {
    it('"999 B" should be equal to "999 B"', function() {
      var bytes = new Bytes('999 B');
      (bytes.humanize()).should.equal('999 B');
    });
  });
  describe('#large value', function() {
    it('"3141592653 B" should be equal to "3.14 GB"', function() {
      var bytes = new Bytes('3141592653 B');
      (bytes.humanize()).should.equal('3.14 GB');
    });
  });
  describe('#extreme value', function() {
    it('"3141592653589793238462643 B" should be equal to "3.14 YB"', function() {
      var bytes = new Bytes('3141592653589793238462643 B');
      (bytes.humanize()).should.equal('3.14 YB');
    });
  });
  describe('#metric option', function() {
    it('"1024 B" should be equal to "1 KiB"', function() {
      var bytes = new Bytes('1024 B');
      (bytes.humanize({ "metric": true })).should.equal('1.00 KiB');
    });
  });
  describe('#precise option', function() {
    it('"3141 B" should be equal to "3.14 KB"', function() {
      var bytes = new Bytes('3141 B');
      (bytes.humanize({ "precise": true })).should.equal('3.141 KB');
    });
  });
  describe('#unit option', function() {
    it('"1 B" should be equal to "8 b"', function() {
      var bytes = new Bytes('1 B');
      (bytes.humanize({ "unit": "b" })).should.equal('8 b');
    });
  });
  describe('#nospace option', function() {
    it('"1000 B" should be equal to "1KB"', function() {
      var bytes = new Bytes('1000 B');
      (bytes.humanize({ "nospace": true })).should.equal('1.00KB');
    });
  });
});
