var moment = require('moment');
var cheerio = require('cheerio');

var Row = function(html) {
  var $ = cheerio.load(html);
  var el = $(html);
  var contentTable = el.find('table');
  //each comment row starts with a table with a single
  //empty cell with an image in it.
  var img = $($(contentTable).find('img')[0]);
  //the indentation can be determined by the width of the image
  this.level = img.attr('width')/40;
  this.comments = [];
  var bodyCell = el.find('td.default');
  var header = el.find('span.comhead');
  var root = hn.root;
  var link = $(header.find('a').last());
  //more link is in different place
  if(!link.length) {
    link = el.find('a');
  }
  if(link.length) {
    this.href = root + link.attr('href').replace('/','');
  }
  var body = el.find('span.comment font');
  if(body.length) {
    this.body = body.first().html();
  }
  this.isMore = function() {
    if(this.isComment()) return false;
    return el.find('a').length > 0;
  }
  if(this.isComment()) {
    var date = header.text().split(' ');
    var now = moment.utc().subtract((date[2]+'s').replace('ss','s'), parseInt(date[1]))
    this.date = now.toDate();
    this.id = this.href.split('=').pop()
  }
}

Row.prototype.isComment = function() {
  return this.body;
}

Row.prototype.push = function(child) {
  this.comments.push(child);
}

var hn = module.exports = {
  root: "https://news.ycombinator.com/",
  parse: function(content) {
    var $ = cheerio.load(content);
    var html = $(content);
    var center = html.find('body').children();
    //omfg
    var tables = center
      .children('table')
      .children('tr')
      .last()
      .prev()
      .children('td')
      .children();

    if(tables.length > 1) {
      var rows = tables
        .first()
        .next()
        .next()
        .next()
        .children('tr');
    } else {
      var rows = tables
        .first()
        .children('tr');
    }

    var result = {
      comments: []
    }

    var comments = []
    for(var i = 0; i < rows.length; i++) {
      var row = new Row(rows[i]);
      if(row.isComment()) {
        comments.push(row);
      } else if(row.isMore()) {
        result.more = row;
      }
    }
    var top = [];
    var filter = function(level, parents, comments) {
      var i = 0;
      var comment;
      while(comment = comments[0]) {
        if(comment.level < level) return;
        if(comment.level === level) {
          parents.push(comments.shift());
        }
        else {
          filter(level+1, parents[parents.length-1].comments, comments);
        }
      }
    }
    filter(0, result.comments, comments);
    return result;
  }
}
