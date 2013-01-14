#hacker-news-parser

Parses the insanely shitty html of hacker news comments into json

## example

```js

var hn = require('hacker-news-parser');
request("https://news.ycombinator.com/item?id=4992617", function(err, res) {
  if(err) throw err;
  var content = hn.parse(res.body);
  console.log(content.comments);
});

```

## api

### hn.parse(html)

parses the html of a hacker news post
_returns:_
```js
var result = {
  comments: [comment], /*array of comment objects*/
  more: moreLink /*moreLink object - null if there is no next page*/
}
```
_note: moreLink will be null if there is no 'more' link at the bottom_


### comment

represents a single comment
```js
var comment = {
  body: /*raw html body of the comment*/
  date: /*date object (UTC) of when the comment was posted*/
  href: /*the uri to the comment*/
}
```

### moreLink

represents a link to the next page (if there is a next page)
```js
var moreLink = {
  href: /*the uri to the next page of comments*/
}
```

## why?

Because hacker news has no public API, and the other modules did too much and/or didn't have test suites.
