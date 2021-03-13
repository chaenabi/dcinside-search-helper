//const axios = require('axios');
const client = require('cheerio-httpcli');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dcinside = 'https://gall.dcinside.com'
const recommend = '&exception_mode=recommend'
const writerSearch = 's_type=search_name'
const contentSearch = 's_type=search_subject_memo'


////////////////////////////////////////////////


const gallname = 'neostock'
const input = '셀리버리'


////////////////////////////////////////////
const keyword = encodeURI(input)

// if you want writer, change contentSearch to writerSearch variable.
// if you search not recommend contents, just remove the variable.
let path = '/board/lists/?id=' + gallname + '&' + contentSearch + '&s_keyword=' + keyword + recommend 



let url = dcinside + path;
let title = "";
let andromeda_cnt = 0;
let date = "";
let saw = "";
let rec_cnt = "";
let sorted_saw = [];
let sorted_rec = [];
let hyper_link = "";
let comment_cnt = "";

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
                        hyper_link = e.querySelectorAll('td')[1].querySelector('.reply_numbox') === null ? dcinside + e.querySelectorAll('td')[1].querySelector('a').getAttribute('href') : 
                                                         e.querySelectorAll('td')[1].querySelector('.reply_numbox').getAttribute('href')
                        comment_cnt =  e.querySelectorAll('td')[1].querySelector('.reply_numbox') === null ? '0' : 
                                                          e.querySelectorAll('td')[1].querySelector('.reply_numbox').querySelector('.reply_num').innerHTML
            
                        date = e.querySelectorAll('td')[3].getAttribute('title')
                        if (date === null) return;
                        saw = e.querySelectorAll('td')[4].innerHTML
                        rec_cnt = e.querySelectorAll('td')[5].innerHTML
                        sorted_rec.push(rec_cnt);
                        sorted_saw.push(saw);
                        title = new JSDOM(e.innerHTML).window.document.querySelector('a').innerHTML.split('</em>')[1]
                        
                        if(hyper_link.includes("&t=cv"))
                        {
                           hyper_link =  hyper_link.split("&t=cv")
                           hyper_link = hyper_link[0]
                        }   

                        andromeda_cnt++
                        console.log(`[게시물 제목] ${title}`)
                        console.log(`[날     짜] ${date}`)
                        console.log(`[조  회  수] ${saw}`)
                        console.log(`[추  천  수] ${rec_cnt}`)
                        console.log(`[댓  글  수] ${comment_cnt}`)
                        console.log(`[링      크] ${hyper_link}`)
                        //console.log(`[념글 카운트] ${andromeda_cnt}`) active only recommend search
                        console.log('---------------------------')
                    }
                    else dom.window.document.querySelector('.ub-writer').setAttribute('user_name', '');
                    
          })
         //console.log(path)
         path = search_next_btn.href
         url = dcinside + path
         getPostContent(url)
       }
    }) 
};

const showStat = () => {   
   getPostContent(url)
   // getMax();
}

const getMax = () => {
   setTimeout(() => {
      console.log(`최대 추천수 :  ${sorted_rec.sort((a, b) => b - a)[0]}`)
      console.log(`최대 조회수 :  ${sorted_saw.sort((a, b) => b - a)[0]}`)
   },  30000)
}

showStat()