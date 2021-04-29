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
  setIntervalId: null,
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
    }, 3000)
  })
}

const createSlide = async () => {
  const slideImages = await fetchSlideShowImages()
  createImageList(slideImages)
  initPagination()
  createDotPagination(slideImages)
  attachClickEventForArrows()
  startAutoSlide(3000)
  nextArrow.classList.add('visible')
  prevArrow.classList.add('visible')
  prevArrow.classList.add('disabled')
}
createSlide()

const createImageList = (slideImages) => {
  const imageListFragment = document.createDocumentFragment()

  slideImages.images.forEach((image, index) => {
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
const initPagination = () => {
  const paginationInitNum = 1
  pagination.innerText = `${paginationInitNum} / ${slideState.images.length}`
}

const attachClickEventForArrows = () => {
  nextArrow.addEventListener('click', () => {
    const nextNum = 1
    changeDotPagination(slideState.currentNum, nextNum)
    changeImage(nextNum)
    changePagination(slideState.currentNum)
    prevArrow.classList.remove('disabled')
    stopAutoSlide()
    startAutoSlide(3000)

    if (isLast(slideState.currentNum)) {
      nextArrow.classList.add('disabled')
    }
  })

  prevArrow.addEventListener('click', () => {
    const prevNum = -1
    changeDotPagination(slideState.currentNum, prevNum)
    changeImage(prevNum)
    changePagination(slideState.currentNum)
    nextArrow.classList.remove('disabled')
    stopAutoSlide()
    startAutoSlide(3000)

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
    isFirst(currentNum) ? prevArrow.classList.add('disabled') : prevArrow.classList.remove('disabled')
    isLast(currentNum) ? nextArrow.classList.add('disabled') : nextArrow.classList.remove('disabled')
    stopAutoSlide()
    startAutoSlide(3000)
  }
}

const changePagination = (currentNum) => {
  pagination.innerText = `${currentNum + 1} / ${slideState.images.length}`
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
}
const dotClickChangePagination = (currentNum) => {
  pagination.textContent = `${currentNum + 1} / ${slideState.images.length}`
}

const autoSlide = () => {
  const _countUp = () => {
    slideState.currentNum++
  }
  const _countReset = () => {
    slideState.currentNum = 0
  }

  if (isLast(slideState.currentNum)) {
    removeIsActive(slideState.currentNum)
    _countReset()
    addIsActive(slideState.currentNum)
    initPagination()
    nextArrow.classList.remove('disabled')
    prevArrow.classList.add('disabled')
  } else {
    removeIsActive(slideState.currentNum)
    _countUp()
    addIsActive(slideState.currentNum)
    changePagination(slideState.currentNum)
  }

  if (!isFirst(slideState.currentNum) || !isLast(slideState.currentNum)) {
    prevArrow.classList.remove('disabled')
    nextArrow.classList.remove('disabled')
  }
  if (isLast(slideState.currentNum)) {
    nextArrow.classList.add('disabled')
  }
  if (isFirst(slideState.currentNum)) {
    prevArrow.classList.add('disabled')
  }
}
const stopAutoSlide = () => {
  clearInterval(slideState.setIntervalId)
}
const startAutoSlide = (time) => {
  slideState.setIntervalId = setInterval(autoSlide, time)
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
const removeIsActive = (currentNum) => {
  slideState.dots[currentNum].classList.remove('active')
  slideState.images[currentNum].classList.remove('active')
}
const addIsActive = (currentNum) => {
  slideState.dots[currentNum].classList.add('active')
  slideState.images[currentNum].classList.add('active')
}
