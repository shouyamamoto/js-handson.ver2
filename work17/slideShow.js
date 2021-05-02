// json取得先
const fetchURL = 'https://jsondata.okiba.me/v1/json/Z96fg210419122813'

// DOMの取得
const slideShow = document.getElementById('js-slideShow')
const slideShowContainer = document.getElementById('js-slideShowContainer')
const prevArrow = document.getElementById('js-prevArrow')
const nextArrow = document.getElementById('js-nextArrow')
const pagination = document.getElementById('js-pagination')

const slideState = {
  currentNum: 0,
  initNum: 1,
  images: []
}

const myFetch = async (fetchURL) => {
  try {
    const res = await fetch(fetchURL)
    const data = await res.json()
    return data
  } catch {
    slideShowContainer.textContent = 'データを取得できませんでした。'
  } finally {
    console.log('myFetch executed')
  }
}

const fetchSlideShowImages = () => {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve(myFetch(fetchURL))
    }, 3000)
  })
}

const createSlide = async () => {
  const slideImages = await fetchSlideShowImages()
  createImageList(slideImages)
  initPagination()
  attachClickEventForArrows()
  nextArrow.classList.add('visible')
  prevArrow.classList.add('visible')
  prevArrow.classList.add('disabled')
}
createSlide()

const createImageList = (slideImages) => {
  const imageListFragment = document.createDocumentFragment()

  slideImages.images.map((image, index) => {
    const li = document.createElement('li')
    const img = document.createElement('img')
    img.classList.add('slideImage')
    if (index === 0) {
      img.classList.add('active')
    }
    img.src = image.imgPath
    li.appendChild(img)
    imageListFragment.appendChild(li)
    slideState.images.push(img)
  })
  slideShow.appendChild(imageListFragment)
}

const attachClickEventForArrows = () => {
  nextArrow.addEventListener('click', () => {
    const nextNum = 1
    changeImage(nextNum)
    changePaginationIncrement(nextNum)
    prevArrow.classList.remove('disabled')

    if (isLast(slideState.currentNum)) {
      nextArrow.classList.add('disabled')
    }
  })

  prevArrow.addEventListener('click', () => {
    const prevNum = -1
    changeImage(prevNum)
    changePaginationDecrement(prevNum)
    nextArrow.classList.remove('disabled')

    if (isFirst(slideState.currentNum)) {
      prevArrow.classList.add('disabled')
    }
  })
}

const changeImage = (num) => {
  if (slideState.currentNum + num >= 0 && slideState.currentNum + num <= slideState.images.length - 1) {
    slideState.images[slideState.currentNum].classList.remove('active')
    slideState.currentNum += num
    slideState.images[slideState.currentNum].classList.add('active')
  }
}

const isLast = (currentNum) => {
  return currentNum === slideState.images.length - 1
}

const isFirst = (currentNum) => {
  return currentNum === 0
}

const initPagination = () => {
  pagination.innerText = `${slideState.initNum} / ${slideState.images.length}`
}
const changePaginationIncrement = (nextNum) => {
  pagination.innerText = `${slideState.currentNum + nextNum} / ${slideState.images.length}`
}
const changePaginationDecrement = (prevNum) => {
  pagination.innerText = `${slideState.currentNum - prevNum} / ${slideState.images.length}`
}
