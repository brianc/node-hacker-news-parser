var fs = require('fs');
var assert = require('assert');

var moment = require('moment');
var request = require('request');

var hn = require(__dirname + '/../lib/');

var parse = function(name) {
  var contents = fs.readFileSync(__dirname + '/assets/' + name + '.html', 'utf8');
  return hn.parse(contents);
}

describe('hacker-news', function() {
  describe('parsing comments', function() {
    describe('simple, single page', function() {
      before(function() {
        this.result = parse('simple');
        this.comments = this.result.comments;
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
        assert.equal(this.comments[1].comments[0].comments.length, 1);
      })

      it('has no "more" link', function() {
        assert.equal(this.result.more, null);
      })
    })

    describe('parsing single comment', function() {
      before(function() {
        var result = parse('simple');
        this.comment = result.comments[0];
      })

      it('has content', function() {
        assert(this.comment.body.indexOf('utm junk') > -1,
              this.comment.body + " should contain 'utm junk'");
      })

      it('has href', function() {
        assert.equal(this.comment.href, 'https://news.ycombinator.com/item?id=5003092');
      })
    })

    describe('date parsing', function() {
      before(function() {
        this.comments = parse('simple').comments;
        this.compare = function(commentIndex, expectedDate) {
          var actual = JSON.stringify(moment(this.comments[commentIndex].date).milliseconds(0).toDate());
          var expected = JSON.stringify(expectedDate.milliseconds(0).toDate());
          assert.equal(actual, expected);
        }
      })
      it('parses 1 hour ago', function() {
        this.compare(0, moment.utc().subtract('hours', 1));
      })
      it('parses 1 day ago', function() {
        this.compare(1, moment.utc().subtract('days', 1));
      })
      it('parses 43 minutes ago', function() {
        this.compare(2, moment.utc().subtract('minutes', 43));
      })
    })

    describe('parsing page with more link', function() {
      before(function() {
        this.result = parse('first');
      })

      it('has more link', function() {
        assert(this.result.more, "more link is missing");
      })

      it('has valid url', function() {
        assert.equal(this.result.more.href, 'https://news.ycombinator.com/x?fnid=L4Utx2mqoS');
      })
    })
  })

  describe('current html', function() {
    before(function(done) {
      var self = this;
      //who's hiring december '
      request("https://news.ycombinator.com/item?id=4992617", function(err, res) {
        self.res = res;
        done(err);
      })
    })

    it('parses', function() {
      this.timeout(500000);
      assert(hn.parse(this.res.body).comments.length > 0, "received no comments")
    })
    
  })
})
