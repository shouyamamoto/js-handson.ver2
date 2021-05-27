
// fetchするJSON
const fetchContentsURL = 'https://jsondata.okiba.me/v1/json/nzTkc210429210909'

// 現在日時を取得
const dayDate = new Date()
const year = dayDate.getFullYear()
const month = dayDate.getMonth() + 1
const day = dayDate.getDate()
const today = new Date(`${year}/${month}/${day}`);

const body = document.querySelector('body')
const tabs = document.getElementById('js-tab')

// 各コンテンツの枠
const contentsWrap = document.createElement('div')
const newsContents = document.createElement('div')
const economyContents = document.createElement('div')
const entertainmentContents = document.createElement('div')
const sportsContents = document.createElement('div')
const japanContents = document.createElement('div')

// 各コンテンツの枠の中
const newsContentsInner = document.createElement('div')
const economyContentsInner = document.createElement('div')
const entertainmentContentsInner = document.createElement('div')
const sportsContentsInner = document.createElement('div')
const japanContentsInner = document.createElement('div')

// 各タイトルのラップ
const newsTitleWrap = document.createElement('ul')
const economyTitleWrap = document.createElement('ul')
const entertainmentTitleWrap = document.createElement('ul')
const sportsTitleWrap = document.createElement('ul')
const japanTitleWrap = document.createElement('ul')

const contents = [newsContents, economyContents, entertainmentContents, sportsContents, japanContents]
const contentsInners = [newsContentsInner, economyContentsInner, entertainmentContentsInner, sportsContentsInner, japanContentsInner]
const titleWraps = [newsTitleWrap, economyTitleWrap, entertainmentTitleWrap, sportsTitleWrap, japanTitleWrap]

contentsWrap.classList.add('contentWrap')
newsContents.id = "js-news"
economyContents.id = "js-economy"
entertainmentContents.id = "js-entertainment"
sportsContents.id = "js-sports"
japanContents.id = "js-japan"

for (let i = 0; i < contents.length; i++) {
  contentsWrap.appendChild(contents[i])
  contents[i].classList.add('content')
  contentsInners[i].classList.add('content__inner')
  titleWraps[i].classList.add('titleWrap')
  body.appendChild(contentsWrap)
}

const tabState = {
  currentNum: 0
}

async function fetchArticle(url) {
  try {
    const response = await fetch(url)
    const json = await response.json()
    return json.articles
  } catch {
    tabs.textContent = 'ただいまサーバー側がぶっこわれています。'
  } finally {
    console.log('fetchArticle run')
  }
}

async function init(url) {
  let articles
  try {
    articles = await fetchArticle(url)
  } catch (e) {
    console.log(e);
  } finally {
    console.log('init executed');
  }

  createTabs(articles)
  createTitles(articles)
  createImages(articles)
  checkContentsIsInit(articles)
}
init(fetchContentsURL)

function createTabs(articles) {
  const tabFrag = document.createDocumentFragment()
  const tabList = []

  for (const article of articles) {
    const { category, isInit } = article
    const tabItem = document.createElement('li')
    tabItem.textContent = category
    tabItem.classList.add('tab__item')
    tabFrag.appendChild(tabItem)
    tabs.appendChild(tabFrag)
    tabList.push(tabItem)

    if (checkTabIsActive(isInit)) {
      addActiveClassName(tabItem)
    }

    addTabId(category, tabItem)
  }
  tabClickAction(tabList)
}

function checkTabIsActive(isInit) {
  if (isInit) return true
}

function addTabId(key, tabItem) {
  const mapCategory = {
    "ニュース": "js-news",
    "経済": "js-economy",
    "エンタメ": "js-entertainment",
    "スポーツ": "js-sports",
    "国内": "js-japan"
  }
  tabItem.dataset.id = mapCategory[key]
}

function tabClickAction(tabList) {
  tabList.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabList[tabState.currentNum].classList.remove('active')
      contents[tabState.currentNum].classList.remove('active')
      tabState.currentNum = index
      tabList[tabState.currentNum].classList.add('active')
      contents[tabState.currentNum].classList.add('active')
    })
  })
}

function checkContentsIsInit(articles) {
  for (const article of articles) {
    const { category, isInit } = article
    if (!isInit) return
    switch (category) {
      case 'ニュース':
        addActiveClassName(newsContents)
        break
      case '経済':
        addActiveClassName(economyContents)
        break
      case 'エンタメ':
        addActiveClassName(entertainmentContents)
        break
      case 'スポーツ':
        addActiveClassName(sportsContents)
        break
      case '国内':
        addActiveClassName(japanContents)
        break
      default:
        addActiveClassName(contents[0])
    }
  }
}

function createTitles(articles) {
  const titleFrag = document.createDocumentFragment()

  for (const article of articles) {
    const { category } = article

    for (const info of article.article) {
      const { title, comment, createdAt } = info
      const titleElement = document.createElement('li')
      const titleLink = document.createElement('a')
      titleElement.classList.add('title')
      titleLink.textContent = title

      const commentElement = document.createElement('span')
      const commentIcon = document.createElement('img')
      commentElement.classList.add('comment')
      commentIcon.classList.add('comment_icon')
      commentIcon.src = 'images/news/comment.png'

      const newIcon = document.createElement('img')
      newIcon.src = 'images/news/new_icon.png'
      newIcon.classList.add('new_icon')

      titleLink.appendChild(commentElement)
      titleElement.appendChild(titleLink)
      titleFrag.appendChild(titleElement)

      const dayLag = getDayLag(createdAt)
      if (dayLag <= 14) {
        addNewIcon(category, titleElement, newIcon)
      }

      if (hasComment(comment)) {
        addCommentIcon(info, commentElement, commentIcon)
      }

      addTitle(category, titleFrag)
    }
  }
}

function hasComment(commentNum) {
  if (commentNum > 0) {
    return true
  }
}

function addCommentIcon(info, commentElement, commentIcon) {
  commentElement.textContent = info.comment
  commentElement.appendChild(commentIcon)
}

function getDayLag(createdAt) {
  // 投稿日と今日との日差を取得
  const postDay = new Date(createdAt)
  const ms = today.getTime() - postDay.getTime()
  const dayLag = Math.floor(ms / (1000 * 60 * 60 * 24))

  return dayLag
}

function addNewIcon(category, titleElement, newIcon) {
  switch (category) {
    case 'ニュース':
      titleElement.appendChild(newIcon)
      break
    case '経済':
      titleElement.appendChild(newIcon)
      break
    case 'エンタメ':
      titleElement.appendChild(newIcon)
      break
    case 'スポーツ':
      titleElement.appendChild(newIcon)
      break
    case '国内':
      titleElement.appendChild(newIcon)
      break
  }
}

function addTitle(category, titleFrag) {
  switch (category) {
    case 'ニュース':
      newsTitleWrap.appendChild(titleFrag)
      newsContentsInner.appendChild(newsTitleWrap)
      newsContents.appendChild(newsContentsInner)
      break
    case '経済':
      economyTitleWrap.appendChild(titleFrag)
      economyContentsInner.appendChild(economyTitleWrap)
      economyContents.appendChild(economyContentsInner)
      break
    case 'エンタメ':
      entertainmentTitleWrap.appendChild(titleFrag)
      entertainmentContentsInner.appendChild(entertainmentTitleWrap)
      entertainmentContents.appendChild(entertainmentContentsInner)
      break
    case 'スポーツ':
      sportsTitleWrap.appendChild(titleFrag)
      sportsContentsInner.appendChild(sportsTitleWrap)
      sportsContents.appendChild(sportsContentsInner)
      break
    case '国内':
      japanTitleWrap.appendChild(titleFrag)
      japanContentsInner.appendChild(japanTitleWrap)
      japanContents.appendChild(japanContentsInner)
      break
  }
}

function createImages(articles) {
  for (const article of articles) {
    const { category, imgPath } = article
    const imgElement = document.createElement('img')
    imgElement.src = imgPath
    imgElement.classList.add('img')

    addImages(category, imgElement)
  }
}

function addImages(category, imgElement) {
  switch (category) {
    case 'ニュース':
      newsContentsInner.appendChild(imgElement)
      newsContents.appendChild(newsContentsInner)
      break
    case '経済':
      economyContentsInner.appendChild(imgElement)
      economyContents.appendChild(economyContentsInner)
      break
    case 'エンタメ':
      entertainmentContentsInner.appendChild(imgElement)
      entertainmentContents.appendChild(entertainmentContentsInner)
      break
    case 'スポーツ':
      sportsContentsInner.appendChild(imgElement)
      sportsContents.appendChild(sportsContentsInner)
      break
    case '国内':
      japanContentsInner.appendChild(imgElement)
      japanContents.appendChild(japanContentsInner)
      break
  }
}

function addActiveClassName(target) {
  target.classList.add('active')
}

// ログアウトボタンを押すとtokenを削除し、login.htmlへ
const logoutBtn = document.getElementById('js-logoutBtn')
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token')
  location.href = './login.html'
})
