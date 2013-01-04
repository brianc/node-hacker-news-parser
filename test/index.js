var fs = require('fs');
var assert = require('assert');

var hn = require(__dirname + '/../lib/');

describe('hacker-news', function() {
  describe('parsing comments', function() {
    describe('simple page', function() {
      before(function() {
        var contents = fs.readFileSync(__dirname + '/assets/simple.html', 'utf8');
        var result = hn.parse(contents);
        this.comments = result.comments;
      })
      it('has top comments', function() {
        assert.equal(this.comments.length, 3);
      })
      it('first top comment has no comments', function() {
        assert.equal(this.comments[0].comments.length, 0);
      })
      it('second top comment has two comments', function() {
        assert.equal(this.comments[1].comments.length, 2);
        assert(this.comments[1].comments[0]);
      })
      it('second top comments child has one child', function() {
        assert.equal(this.comments[1].comments[0].length, 1);
      })
    })
  })
})
