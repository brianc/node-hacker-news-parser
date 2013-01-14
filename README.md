#hacker-news-parser

Parses the insanely shitty html of hacker news comments into json

## example

```js

var hn = require('hacker-news-parser');
request("https://news.ycombinator.com/item?id=4992617", function(err, res) {
  if(err) throw err;
  var content = hn.parse(res.body);
  console.log(content.comments);

```

## api

### hn.parse(html)

parses the html of a hacker news post

returns `{comments: [comment], more: moreLink}`
_note: moreLink will be null if there is no 'more' link at the bottom_


### comment

represents a single comment

#### body

raw html body of the comment

#### date

utc date of the comment

#### href

url to the comment


### moreLink

#### href

url to the next page of comments
