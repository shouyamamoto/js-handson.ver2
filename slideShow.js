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
  initPagination()
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

const attachClickEventForArrows = () => {
  nextArrow.addEventListener('click', () => {
    const nextNum = 1
    changeDotPagination(slideState.currentNum, nextNum)
    changeImage(nextNum)
    changePaginationIncrement(slideState.currentNum, nextNum)
    prevArrow.classList.remove('disabled')

    if (isLast(slideState.currentNum)) {
      nextArrow.classList.add('disabled')
    }
  })

  prevArrow.addEventListener('click', () => {
    const prevNum = -1
    changeDotPagination(slideState.currentNum, prevNum)
    changeImage(prevNum)
    changePaginationDecrement(slideState.currentNum, prevNum)
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

const attachClickEventForDot = (dot, currentNum, index) => {
  if (!isActive(dot)) {
    slideState.dots[currentNum].classList.remove('active')
    slideState.dots[index].classList.add('active')
    currentNum = index
    dotClickChangeImage(currentNum)
    dotClickChangePagination(currentNum)

    if (isLast(currentNum)) {
      nextArrow.classList.add('disabled')
    } else {
      nextArrow.classList.remove('disabled')
    }

    if (isFirst(currentNum)) {
      prevArrow.classList.add('disabled')
    } else {
      prevArrow.classList.remove('disabled')
    }
  }
}

const isActive = (dot) => {
  return dot.classList.contains('active')
}

const dotClickChangeImage = (num) => {
  slideState.images[slideState.currentNum].classList.remove('active')
  slideState.currentNum = num
  slideState.images[slideState.currentNum].classList.add('active')
}

const dotClickChangePagination = (currentNum) => {
  pagination.textContent = `${currentNum + 1} / ${slideState.images.length}`
}
