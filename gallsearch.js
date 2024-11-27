const fs = require('fs')
const path = require('path')
const axios = require('axios')
const iconv = require('iconv-lite')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const resultFile = path.join(__dirname, 'result.txt')
const writeStream = fs.createWriteStream(resultFile, { encoding: 'utf8' })

const dcinside = 'https://gall.dcinside.com'
const gallname = 'programming' // 갤러리 코드: 프로그래밍 갤러리라면 (programming), 해외주식 갤러리라면 (tenbagger)
const input = '원하는 검색어' // 검색어
const keyword = encodeURIComponent(input)
const writerSearch = 's_type=search_name' // 작성자로 검색
let p = `/board/lists/?id=${gallname}&${writerSearch}&s_keyword=${keyword}`
const url = dcinside + p

let maxRec = 0
let maxSaw = 0

const logToFile = message => {
  writeStream.write(message + '\n')
}

const fetchPosts = async url => {
  try {
    let currentPage = url

    while (currentPage) {
      const response = await axios.get(currentPage, {
        responseType: 'arraybuffer',
      })
      const decodedData = iconv.decode(response.data, 'EUC-KR') // EUC-KR → UTF-8 변환
      const dom = new JSDOM(decodedData)
      const document = dom.window.document

      const rows = document.querySelectorAll('tr.ub-content')

      for (let row of rows) {
        try {
          const writerElem = row.querySelector('td:nth-child(4)')
          if (!writerElem) continue

          const writer = writerElem.getAttribute('data-nick')
          if (writer === '운영자') continue // 운영자는 제외

          const titleElem = row.querySelector('td:nth-child(2) a')
          const title = titleElem ? titleElem.textContent.trim() : '제목 없음'

          const dateElem = row.querySelector('td:nth-child(5)')
          const date = dateElem ? dateElem.getAttribute('title') : '날짜 없음'

          const sawElem = row.querySelector('td:nth-child(6)')
          const saw = sawElem ? parseInt(sawElem.textContent, 10) : 0

          const recElem = row.querySelector('td:nth-child(7)')
          const rec = recElem ? parseInt(recElem.textContent, 10) : 0

          const commentBox = row.querySelector('.reply_num')
          const commentCount = commentBox ? commentBox.textContent.trim() : '0'

          const linkElem = row.querySelector('td:nth-child(2) a')
          const link = linkElem
            ? dcinside + linkElem.getAttribute('href')
            : '링크 없음'

          logToFile(`[게시물 제목] ${title}`)
          logToFile(`[글  쓴  이] ${writer}`)
          logToFile(`[날     짜] ${date}`)
          logToFile(`[조  회  수] ${saw}`)
          logToFile(`[추  천  수] ${rec}`)
          logToFile(`[댓  글  수] ${commentCount}`)
          logToFile(`[링      크] ${link}`)
          logToFile('---------------------------')

          maxRec = Math.max(maxRec, rec)
          maxSaw = Math.max(maxSaw, saw)
        } catch (innerError) {
          console.error('행 처리 중 오류 발생:', innerError.message)
        }
      }

      // 다음 페이지로 이동
      const nextButton = document.querySelector('.search_next')
      if (nextButton) {
        currentPage = dcinside + nextButton.getAttribute('href')
      } else {
        currentPage = null // 마지막 페이지 도달
      }
    }
  } catch (error) {
    console.error('페이지 처리 중 오류 발생:', error.message)
  }
}

const showStats = async () => {
  await fetchPosts(url)
  logToFile(`최대 추천수: ${maxRec}`)
  logToFile(`최대 조회수: ${maxSaw}`)
}

showStats()
