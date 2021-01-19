const axios = require('axios');
const client = require('cheerio-httpcli');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dcinside = 'https://gall.dcinside.com'
const input = '여소환';
const keyword = encodeURI(input);
const recommend = '&exception_mode=recommend';
let path = '/board/lists/?id=bns&s_type=search_name&s_keyword=' + keyword + recommend;
let url = dcinside + path;
let title = "";
let andromeda_cnt = 0;
let date = "";

client.fetch(url, {}, function (error, $, res, body) {
  //  console.log('error:', error)
  //  console.log('$:', $)
});

const getPostContent = (url) => {
    request({ url: url }, function (error, response, body) {
       const dom = new JSDOM(body)
     
        if ((search_next_btn = dom.window.document.querySelector('.search_next')) !== null) {
          const tbody = dom.window.document.querySelectorAll('tr.ub-content')
          tbody.forEach((e) => {
                     if (dom.window.document.querySelector('.ub-writer').getAttribute('user_name') !== '운영자') {  
                        date = e.querySelectorAll('td')[3].getAttribute('title')
                       title = new JSDOM(e.innerHTML).window.document.querySelector('a').innerHTML.split('</em>')[1]
                       andromeda_cnt++
                       console.log(`[게시물 제목] ${title}`)
                       console.log(`[날       짜] ${date}`)
                       console.log(`[갯수 카운트] ${andromeda_cnt}`)
                       console.log('---------------------------')
                    }
                    else dom.window.document.querySelector('.ub-writer').setAttribute('user_name', '');
                    
          })
         //console.log(path)
         path = search_next_btn.href
         url = dcinside + path
         getPostContent(url)
       }
    }); 
};

getPostContent(url)