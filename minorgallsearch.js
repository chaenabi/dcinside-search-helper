const axios = require('axios')
const iconv = require('iconv-lite')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const dcinside = 'https://gall.dcinside.com'
const gallname = 'github' // 갤러리 이름
const input = '검색어' // 검색 키워드
const keyword = encodeURIComponent(input)
const writerSearch = 's_type=search_name' // 작성자로 검색
const path = `/board/lists/?id=${gallname}&${writerSearch}&s_keyword=${keyword}`
const url = dcinside + path

let maxRec = 0
let maxSaw = 0

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
          if (!writerElem) continue // 작성자 데이터가 없는 행 건너뜀

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

          console.log(`[title]       ${title}`)
          console.log(`[date]        ${date}`)
          console.log(`[sawCount]    ${saw}`)
          console.log(`[recommended] ${rec}`)
          console.log(`[comments]    ${commentCount}`)
          console.log(`[link]        ${link}`)
          console.log('---------------------------')

          maxRec = Math.max(maxRec, rec)
          maxSaw = Math.max(maxSaw, saw)
        } catch (innerError) {
          console.error('행 처리 중 오류 발생:', innerError.message)
        }
      }

      // 다음 페이지 링크 탐색
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
  console.log(`최대 추천수: ${maxRec}`)
  console.log(`최대 조회수: ${maxSaw}`)
}

showStats()
