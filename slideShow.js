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
  paginationInitNum: 1,
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
    if (isFirst(index)) {
      dot.classList.add('active')
    }
    slideState.dots.push(dot)
    dot.addEventListener('click', () => attachClickEventForDot(dot, slideState.currentNum, index))
    dotPaginationFragment.appendChild(dot)
  })
  dotPagination.appendChild(dotPaginationFragment)
}
const createPagination = () => {
  pagination.innerText = `${slideState.paginationInitNum} / ${slideState.images.length}`
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
    currentNum = index
    slideState.dots[currentNum].classList.add('active')
    dotClickChangeImage(currentNum)
    dotClickChangePagination(currentNum)
    isFirst(slideState.currentNum) ? addDisableClassForArrow(prevArrow) : removeDisableClassForArrow(prevArrow)
    isLast(slideState.currentNum) ? addDisableClassForArrow(nextArrow) : removeDisableClassForArrow(nextArrow)
  }
}

const isLast = (currentNum) => {
  return currentNum === slideState.images.length - 1
}
const isFirst = (currentNum) => {
  return currentNum === 0
}
const isActive = (target) => {
  return target.classList.contains('active')
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

const resetSlide = () => {
  removeActiveClassForImage(slideState.images[slideState.currentNum])
  removeActiveClassForDot(slideState.dots[slideState.currentNum])
  addDisableClassForArrow(nextArrow)
  resetCurrentNum()
  resetPagination()
  loopCountIncrement()
}

const autoSlideChange = () => {
  // もし最後のnumならば
  if (isLast(slideState.currentNum)) {
    resetSlide()
  }

  // 初回ループ時
  if (slideState.loopCount === 0) {
    removeActiveClassForImage(slideState.images[slideState.currentNum])
    removeActiveClassForDot(slideState.dots[slideState.currentNum])
    currentNumIncrement()
    addActiveClassForImage(slideState.images[slideState.currentNum])
    addActiveClassForDot(slideState.dots[slideState.currentNum])
    changePaginationIncrement(slideState.currentNum, slideState.nextNum)

    isFirst(slideState.currentNum) ? addDisableClassForArrow(prevArrow) : removeDisableClassForArrow(prevArrow)
    isLast(slideState.currentNum) ? addDisableClassForArrow(nextArrow) : removeDisableClassForArrow(nextArrow)
    return
  }

  // 2回目のループかつ、currentNumが0のとき
  if (slideState.loopCount > 0 && isFirst(slideState.currentNum)) {
    // 1枚目の画像にactiveクラスがついているときの処理
    if (isActive(slideState.images[slideState.currentNum])) {
      removeActiveClassForImage(slideState.images[slideState.currentNum])
      removeActiveClassForDot(slideState.dots[slideState.currentNum])
      currentNumIncrement()
      addActiveClassForImage(slideState.images[slideState.currentNum])
      addActiveClassForDot(slideState.dots[slideState.currentNum])
      changePaginationIncrement(slideState.currentNum, slideState.nextNum)
      removeDisableClassForArrow(prevArrow)
      return
    }

    // 1枚目の画像にactiveクラスがついていないときの処理
    if (!isActive(slideState.images[slideState.currentNum])) {
      addActiveClassForImage(slideState.images[slideState.currentNum])
      addActiveClassForDot(slideState.dots[slideState.currentNum])
      addDisableClassForArrow(prevArrow)
      removeDisableClassForArrow(nextArrow)
      return
    }
  }

  // 2回目以降のループかつ、currentNumが0ではないとき
  if (slideState.loopCount > 0 && !isFirst(slideState.currentNum)) {
    removeActiveClassForImage(slideState.images[slideState.currentNum])
    removeActiveClassForDot(slideState.dots[slideState.currentNum])
    currentNumIncrement()
    addActiveClassForImage(slideState.images[slideState.currentNum])
    addActiveClassForDot(slideState.dots[slideState.currentNum])
    changePaginationIncrement(slideState.currentNum, slideState.nextNum)
    isLast(slideState.currentNum) ? addDisableClassForArrow(nextArrow) : null
  }
}
const setIntervalId = setInterval(autoSlideChange, 3000)

const removeActiveClassForImage = (image) => {
  image.classList.remove('active')
  slideState.images[slideState.currentNum].classList.remove('active')
  slideState.dots[slideState.currentNum].classList.remove('active')
}
const removeActiveClassForDot = (dot) => {
  dot.classList.remove('active')
}
const addActiveClassForImage = (image) => {
  image.classList.add('active')
}
const addActiveClassForDot = (dot) => {
  dot.classList.add('active')
}
const loopCountIncrement = () => {
  slideState.loopCount++
}
const resetCurrentNum = () => {
  slideState.currentNum = 0
}
const resetPagination = () => {
  pagination.innerText = `${slideState.paginationInitNum} / ${slideState.images.length}`
}
const addDisableClassForArrow = (targetArrow) => {
  targetArrow.classList.add('disabled')
}
const removeDisableClassForArrow = (targetArrow) => {
  targetArrow.classList.remove('disabled')
}
const currentNumIncrement = () => {
  slideState.currentNum += slideState.nextNum
}
