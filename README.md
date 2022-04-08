커뮤니티 사이트 (dcinside) 게시물/글쓴이 검색 한번 당 1만건씩 조회되어
사용자 경험이 좋지 않은 문제가 있습니다.
이 를 해결하기 위해 자동으로 검색을 지속적으로 수행하여 txt 파일 등으로 추출하는 기능을 지원합니다.


gallSearch.js 등의 파일에서 검색어 혹은 글쓴이를 설정하고

```
$ node gallSearch.js > result.txt
```

등의 명령어로 검색 결과를 가져올 수 있습니다.

# 상세 설명서

1. nodejs 설치
2. vscode 설치하고 
2-1. nodejs 설정 세팅 (선택사항)
2-1. npm install 
2-2. npm install cheerio
3. gallsearch.js or minigallsearch.js or minorgallsearch.js 파일에서 const input = '설명' 부분을 찾는다.
4. 검색을 원하는 내용으로 바꾼다 예시) const input = "ㅎㅇ" -> ㅎㅇ라고 적힌 게시물을 찾을 수 있다.
4. 터미널에서 node minigallsearch.js > result.txt
5. result.txt를 통해 결과를 수집완료

ps. 글쓴이 검색, 개념글이 아닌 일반 글 검색도 세팅가능 
const writerSearch = 's_type=search_name'
const contentSearch = 's_type=search_subject_memo'
const recommend = '&exception_mode=recommend'
등이 해당 세팅이고,

let path = mini + '/board/lists/?id=' + gallname + '&' + contentSearch + '&s_keyword=' + keyword + recommend 
에서 위의 변수들을 적절하게 변경해주면 됩니다.

예를들어 개념글이 아닌 일반글검색을 하고 싶으면 let path = .... keyword + recommend 부분에서, + recommend를 지우거나 주석처리하면 된다.

윈도우 환경에서 한글이 깨지는 문제가 있습니다. 지금 버전에서는 맥환경에서만 한글이 정상 출력됩니다.