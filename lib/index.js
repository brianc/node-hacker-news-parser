var $ = require('jquery');

var Row = function(html) {
  this.html = html;
  this.el = $(html);
  var contentTable = this.el.find('table');
  //each comment row starts with a table with a single
  //empty cell with an image in it.
  var img = $($(contentTable).find('img')[0]);
  //the indentation can be determined by the width of the image
  this.level = img.attr('width')/40;
  this.comments = [];
}

Row.prototype.isComment = function() {
  return true;
}

Row.prototype.push = function(child) {
  this.comments.push(child);
}

module.exports = {
  parse: function(content) {
    var html = $(content);
    var center = html.find('body').children();
    //omfg
    var tables = center
      .children('table')
      .children('tr')
      .first()
      .next()
      .next()
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

    var comments = []
    for(var i = 0; i < rows.length; i++) {
      comments.push(new Row(rows[i]));
    }
    var top = [];
    var filter = function(level, up, comments) {
      var comment = comments.shift();
      while(comment) {
        console.log("comment: %d level: %d", comment.level, level)
        if(comment.level === level) {
          up.push(comment);
        } else if(comment.level === level+1) {
          filter(up[up.length-1].level, up[up.length-1].comments, comments);
        } else {
          filter(comment.level-1, up, comments);
        }
        comment = comments.shift();
      }
    }
    filter(0, top, comments);

    return { comments: top }
  }
}
