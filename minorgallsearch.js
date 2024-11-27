const fs = require('fs')
const path = require('path')
//const axios = require('axios');
const client = require('cheerio-httpcli')
const request = require('request')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const resultFile = path.join(__dirname, 'result.txt')
const writeStream = fs.createWriteStream(resultFile, { encoding: 'utf8' })

///////////////////////////////////////////////////////////////////////
const dcinside = 'https://gall.dcinside.com'
const recommend = '&exception_mode=recommend'
const writerSearch = 's_type=search_name' // search writer. select below or this.
const contentSearch = 's_type=search_subject_memo'
const minorgallary = '/mgallery'

//////////////////////////////////////////////////////////////////
// changable value
const gallname = 'onshinproject'
const input = '각청'

/////////////////////////////////////////////////////////////////////////////
const keyword = encodeURI(input)

//url example : https://gall.dcinside.com/mgallery/board/lists?id=tenbagger&s_type=search_subject_memo&s_keyword=gme&exception_mode=recommend

// if you want writer, change contentSearch to writerSearch variable.
// if you search not recommend contents, just remove the variable.
// mini for only mini gallary. if you not search mini gallary, remove the variable.
let p =
  minorgallary +
  '/board/lists/?id=' +
  gallname +
  '&' +
  contentSearch +
  '&s_keyword=' +
  keyword // + recommend

let url = dcinside + p
let title = ''
let andromeda_cnt = 0
let date = ''
let saw = ''
let rec_cnt = ''
let sorted_saw = []
let sorted_rec = []
let hyper_link = ''
let comment_cnt = ''
let writer = ''

client.fetch(url, {}, function (error, $, res, body) {
  //  console.log('error:', error)
  //  console.log('$:', $)
})

const logToFile = message => {
  writeStream.write(message + '\n')
}

const getPostContent = url => {
  request({ url: url }, function (error, response, body) {
    const dom = new JSDOM(body)

    if (
      (search_next_btn = dom.window.document.querySelector('.search_next')) !==
      null
    ) {
      const tbody = dom.window.document.querySelectorAll('tr.ub-content')
      tbody.forEach(e => {
        if (
          e.querySelectorAll('td')[3].getAttribute('data-nick') !== '운영자'
        ) {
          hyper_link =
            e.querySelectorAll('td')[2].querySelector('.reply_numbox') === null
              ? dcinside +
                e
                  .querySelectorAll('td')[2]
                  .querySelector('a')
                  .getAttribute('href')
              : e
                  .querySelectorAll('td')[2]
                  .querySelector('.reply_numbox')
                  .getAttribute('href')
          comment_cnt =
            e.querySelectorAll('td')[2].querySelector('.reply_numbox') === null
              ? '0'
              : e
                  .querySelectorAll('td')[2]
                  .querySelector('.reply_numbox')
                  .querySelector('.reply_num').innerHTML
          writer = e
            .querySelectorAll('td')[3]
            .firstElementChild.getAttribute('title')

          date = e.querySelectorAll('td')[4].getAttribute('title')
          if (writer === null) return
          saw = e.querySelectorAll('td')[5].innerHTML
          rec_cnt = e.querySelectorAll('td')[6].innerHTML
          sorted_rec.push(rec_cnt)
          sorted_saw.push(saw)
          title = new JSDOM(e.innerHTML).window.document
            .querySelector('a')
            .innerHTML.split('</em>')[1]

          if (hyper_link.includes('&t=cv')) {
            hyper_link = hyper_link.split('&t=cv')
            hyper_link = hyper_link[0]
          }

          andromeda_cnt++

          logToFile(`[게시물 제목] ${title}`)
          logToFile(`[글  쓴  이] ${writer}`)
          logToFile(`[날     짜] ${date}`)
          logToFile(`[조  회  수] ${saw}`)
          logToFile(`[추  천  수] ${rec_cnt}`)
          logToFile(`[댓  글  수] ${comment_cnt}`)
          logToFile(`[링      크] ${hyper_link}`)
          logToFile('---------------------------')
          //console.log(`[념글 카운트] ${andromeda_cnt}`) active only recommend search
          console.log('---------------------------')
        } else
          dom.window.document
            .querySelector('.ub-writer')
            .setAttribute('user_name', '')
      })
      //console.log(p)
      p = search_next_btn.href
      url = dcinside + p
      getPostContent(url)
    }
  })
}

const showStat = () => {
  getPostContent(url)
  // getMax();
}

const getMax = () => {
  setTimeout(() => {
    logToFile(`최대 추천수: ${sorted_rec.sort((a, b) => b - a)[0]}`)
    logToFile(`최대 조회수: ${sorted_saw.sort((a, b) => b - a)[0]}`)
  }, 30000)
}

showStat()
