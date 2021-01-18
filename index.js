const axios = require('axios');
const client = require('cheerio-httpcli');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dcinside = 'https://gall.dcinside.com'
const input = '!';
const keyword = encodeURI(input);
const recommend = '&exception_mode=recommend';
let path = '/board/lists/?id=bns&s_type=search_subject_memo&s_keyword=' + keyword + recommend;
let url = dcinside + path;
let result = "";

client.fetch(url, {}, function (error, $, res, body) {
  //  console.log('error:', error);
  //  console.log('$:', $);
});

const getPostContent = (url) => {
    request({ url: url }, function (error, response, body) {
       const dom = new JSDOM(body);
        console.log(path)
       if ((search_next_btn = dom.window.document.querySelector('.search_next')) !== null) {
          const tbody = dom.window.document.querySelectorAll('tr.ub-content, tr.ub-content.gall_tit ub-word');
          tbody.forEach((e) => {
                    result += e.innerHTML
          })
         path = search_next_btn.href;
         url = dcinside + path;
         getPostContent(url); // 비동기식이라. path가 변하지 않아 무한루프
        console.log(result);
       }
    });    
};

getPostContent(url);