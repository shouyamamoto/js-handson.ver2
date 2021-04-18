// json取得先
const fetchURL = 'https://jsondata.okiba.me/v1/json/IOQ9t210418034754'

// DOMの取得
const slideShow = document.getElementById('js-slideShow')
const slideShowContainer = document.getElementById('js-slideShowContainer')
const prevArrow = document.getElementById('js-prevArrow')
const nextArrow = document.getElementById('js-nextArrow')
const pageNation = document.getElementById('js-pageNation')

// クラス名の追加
slideShow.classList.add('slideShow')
slideShowContainer.classList.add('slideShowContainer')
prevArrow.classList.add('hidden')
nextArrow.classList.add('hidden')

let currentNum = 0
const slideImageArray = []

const myFetch = async (fetchURL) => {
  try {
    const res = await fetch(fetchURL)
    const data = await res.json()
    return data
  } catch (e) {
    console.log(e.error)
  } finally {
    console.log('myFetch run')
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
  const SlideImages = await fetchSlideShowImages()
  createImageList(SlideImages)
  initPageNation()
  nextArrow.classList.remove('hidden')
  prevArrow.classList.remove('hidden')
  prevArrow.classList.add('disabled')
}
createSlide()

const createImageList = (SlideImages) => {
  const imageListFrag = document.createDocumentFragment()

  SlideImages.images.map((image, index) => {
    const li = document.createElement('li')
    const img = document.createElement('img')
    img.classList.add('slideImage')
    if (index === 0) {
      img.classList.add('active')
    }
    img.src = image.imgPath
    li.appendChild(img)
    imageListFrag.appendChild(li)
    slideImageArray.push(img)
  })
  slideShowContainer.appendChild(imageListFrag)
}

const onClickArrow = () => {
  nextArrow.addEventListener('click', () => {
    changeImage(1)
    changePageNationIncrement(1)
    prevArrow.classList.remove('disabled')

    if (isLast(currentNum)) {
      nextArrow.classList.add('disabled')
    }
  })

  prevArrow.addEventListener('click', () => {
    changeImage(-1)
    changePageNationDecrement(-1)
    nextArrow.classList.remove('disabled')

    if (isFirst(currentNum)) {
      prevArrow.classList.add('disabled')
    }
  })
}
onClickArrow()

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

const initPageNation = () => {
  pageNation.innerText = `${currentNum + 1} / ${slideImageArray.length}`
}
const changePageNationIncrement = (num) => {
  pageNation.innerText = `${currentNum + num} / ${slideImageArray.length}`
}
const changePageNationDecrement = (num) => {
  pageNation.innerText = `${currentNum - num} / ${slideImageArray.length}`
}
