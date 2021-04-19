// json取得先
const fetchURL = 'https://jsondata.okiba.me/v1/json/Z96fg210419122813'

// DOMの取得
const slideShow = document.getElementById('js-slideShow')
const slideShowContainer = document.getElementById('js-slideShowContainer')
const prevArrow = document.getElementById('js-prevArrow')
const nextArrow = document.getElementById('js-nextArrow')
const pagination = document.getElementById('js-pagination')

let currentNum = 0
const slideImageArray = []

const myFetch = async (fetchURL) => {
  try {
    const res = await fetch(fetchURL)
    console.log(res)
    const data = await res.json()
    return data
  } catch {
    alert('データを取得できませんでした。')
  } finally {
    console.log('myFetch execute')
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
  clickArrow()
  nextArrow.classList.remove('hidden')
  prevArrow.classList.remove('hidden')
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
    slideImageArray.push(img)
  })
  slideShow.appendChild(imageListFragment)
}

const clickArrow = () => {
  nextArrow.addEventListener('click', () => {
    changeImage(1)
    changePaginationIncrement(1)
    prevArrow.classList.remove('disabled')

    if (isLast(currentNum)) {
      nextArrow.classList.add('disabled')
    }
  })

  prevArrow.addEventListener('click', () => {
    changeImage(-1)
    changePaginationDecrement(-1)
    nextArrow.classList.remove('disabled')

    if (isFirst(currentNum)) {
      prevArrow.classList.add('disabled')
    }
  })
}

const changeImage = (num) => {
  if (currentNum + num >= 0 && currentNum + num <= slideImageArray.length - 1) {
    slideImageArray[currentNum].classList.remove('active')
    currentNum += num
    slideImageArray[currentNum].classList.add('active')
  }
}

const isLast = (currentNum) => {
  return currentNum === slideImageArray.length - 1
}

const isFirst = (currentNum) => {
  return currentNum === 0
}

const initPagination = () => {
  pagination.innerText = `${currentNum + 1} / ${slideImageArray.length}`
}
const changePaginationIncrement = (num) => {
  pagination.innerText = `${currentNum + num} / ${slideImageArray.length}`
}
const changePaginationDecrement = (num) => {
  pagination.innerText = `${currentNum - num} / ${slideImageArray.length}`
}
