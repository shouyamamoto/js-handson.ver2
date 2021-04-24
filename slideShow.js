// json取得先
const fetchURL = 'https://jsondata.okiba.me/v1/json/Z96fg210419122813'

// DOMの取得
const slideShow = document.getElementById('js-slideShow')
const slideShowContainer = document.getElementById('js-slideShowContainer')
const prevArrow = document.getElementById('js-prevArrow')
const nextArrow = document.getElementById('js-nextArrow')
const pagination = document.getElementById('js-pagination')
const dotPagination = document.getElementById('js-dotPagination')

const slideState = {
  currentNum: 0,
  initNum: 1,
  nextNum: 1,
  prevNum: -1,
  loopCount: 0,
  images: [],
  dots: [],
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
    }, 100)
  })
}

const createSlide = async () => {
  const slideImages = await fetchSlideShowImages()
  createImageList(slideImages)
  createPagination()
  createDotPagination(slideImages)
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
const createDotPagination = (slideImages) => {
  const dotPaginationFragment = document.createDocumentFragment()

  slideImages.images.forEach((image, index) => {
    const dot = document.createElement('span')
    if (index === slideState.currentNum) {
      dot.classList.add('active')
    }
    slideState.dots.push(dot)
    dot.addEventListener('click', () => attachClickEventForDot(dot, slideState.currentNum, index))
    dotPaginationFragment.appendChild(dot)
  })
  dotPagination.appendChild(dotPaginationFragment)
}
const createPagination = () => {
  pagination.innerText = `${slideState.initNum} / ${slideState.images.length}`
}

const attachClickEventForArrows = () => {
  nextArrow.addEventListener('click', () => {
    changeDotPagination(slideState.currentNum, slideState.nextNum)
    changeImage(slideState.nextNum)
    changePaginationIncrement(slideState.currentNum, slideState.nextNum)
    prevArrow.classList.remove('disabled')
    clearInterval(setIntervalId)

    if (isLast(slideState.currentNum)) {
      nextArrow.classList.add('disabled')
    }
  })

  prevArrow.addEventListener('click', () => {
    changeDotPagination(slideState.currentNum, slideState.prevNum)
    changeImage(slideState.prevNum)
    changePaginationDecrement(slideState.currentNum, slideState.prevNum)
    nextArrow.classList.remove('disabled')
    clearInterval(setIntervalId)

    if (isFirst(slideState.currentNum)) {
      prevArrow.classList.add('disabled')
    }
  })
}
const attachClickEventForDot = (dot, currentNum, index) => {
  if (isActive(dot)) {
    return
  }
  else {
    slideState.dots[currentNum].classList.remove('active')
    slideState.dots[index].classList.add('active')
    currentNum = index
    dotClickChangeImage(currentNum)
    dotClickChangePagination(currentNum)

    isLast(currentNum) ? nextArrow.classList.add('disabled') : nextArrow.classList.remove('disabled')
    isFirst(currentNum) ? prevArrow.classList.add('disabled') : prevArrow.classList.remove('disabled')
  }
}

const isLast = (currentNum) => {
  return currentNum === slideState.images.length - 1
}
const isFirst = (currentNum) => {
  return currentNum === 0
}
const isActive = (dot) => {
  return dot.classList.contains('active')
}

const changePaginationIncrement = (currentNum, nextNum) => {
  pagination.innerText = `${currentNum + nextNum} / ${slideState.images.length}`
}
const changePaginationDecrement = (currentNum, prevNum) => {
  pagination.innerText = `${currentNum - prevNum} / ${slideState.images.length}`
}
const changeDotPagination = (currentNum, num) => {
  slideState.dots[currentNum].classList.remove('active')
  currentNum += num
  slideState.dots[currentNum].classList.add('active')
}

const changeImage = (num) => {
  if (slideState.currentNum + num >= 0 && slideState.currentNum + num <= slideState.images.length - 1) {
    slideState.images[slideState.currentNum].classList.remove('active')
    slideState.currentNum += num
    slideState.images[slideState.currentNum].classList.add('active')
  }
}
const dotClickChangeImage = (num) => {
  slideState.images[slideState.currentNum].classList.remove('active')
  slideState.currentNum = num
  slideState.images[slideState.currentNum].classList.add('active')
  clearInterval(setIntervalId)
}
const dotClickChangePagination = (currentNum) => {
  pagination.textContent = `${currentNum + 1} / ${slideState.images.length}`
}
const autoSlideChange = () => {
  // もし最後のnumならば
  if (isLast(slideState.currentNum)) {
    slideState.images[slideState.currentNum].classList.remove('active')
    slideState.dots[slideState.currentNum].classList.remove('active')
    nextArrow.classList.add('disabled')
    slideState.currentNum = 0
    pagination.innerText = `${slideState.currentNum + 1} / ${slideState.images.length}`
    slideState.loopCount++
  }

  // 1週目のみ
  if (isFirst(slideState.loopCount)) {
    slideState.images[slideState.currentNum].classList.remove('active')
    slideState.dots[slideState.currentNum].classList.remove('active')
    slideState.currentNum += slideState.nextNum
    slideState.images[slideState.currentNum].classList.add('active')
    slideState.dots[slideState.currentNum].classList.add('active')
    pagination.innerText = `${slideState.currentNum + 1} / ${slideState.images.length}`

    isFirst(slideState.currentNum) ? prevArrow.classList.add('disabled') : prevArrow.classList.remove('disabled')
    isLast(slideState.currentNum) ? nextArrow.classList.add('disabled') : nextArrow.classList.remove('disabled')
    return
  }

  // 2週目で、0番目の写真がきたら 0枚目と1つめのドットをactiveに
  if (slideState.loopCount !== 0 && isFirst(slideState.currentNum) && !slideState.images[slideState.currentNum].classList.contains('active')) {
    slideState.images[slideState.currentNum].classList.add('active')
    slideState.dots[slideState.currentNum].classList.add('active')
    prevArrow.classList.add('disabled')
    nextArrow.classList.remove('disabled')
    return
  }

  // 2週目いこう、0番目、0番目にactiveがついていたら
  if (slideState.loopCount !== 0 && isFirst(slideState.currentNum) && slideState.images[slideState.currentNum].classList.contains('active')) {
    slideState.images[slideState.currentNum].classList.remove('active')
    slideState.dots[slideState.currentNum].classList.remove('active')
    slideState.currentNum += slideState.nextNum
    slideState.images[slideState.currentNum].classList.add('active')
    slideState.dots[slideState.currentNum].classList.add('active')
    pagination.innerText = `${slideState.currentNum + 1} / ${slideState.images.length}`
    prevArrow.classList.remove('disabled')
    return
  }

  slideState.images[slideState.currentNum].classList.remove('active')
  slideState.dots[slideState.currentNum].classList.remove('active')
  slideState.currentNum += slideState.nextNum
  slideState.images[slideState.currentNum].classList.add('active')
  slideState.dots[slideState.currentNum].classList.add('active')
  pagination.innerText = `${slideState.currentNum + 1} / ${slideState.images.length}`

  if (isLast(slideState.currentNum)) {
    nextArrow.classList.add('disabled')
  }
}
const setIntervalId = setInterval(autoSlideChange, 3000)