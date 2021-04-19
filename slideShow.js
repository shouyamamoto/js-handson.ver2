// json取得先
const fetchURL = 'https://fdsafdsajsondata.okiba.me/v1/json/IOQ9t210418034754'

// DOMの取得
const slideShow = document.getElementById('js-slideShow')
const slideShowContainer = document.getElementById('js-slideShowContainer')
const prevArrow = document.getElementById('js-prevArrow')
const nextArrow = document.getElementById('js-nextArrow')
const pagination = document.getElementById('js-pagination')

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
    console.log(res)
    const data = await res.json()
    return data
  } catch {
    alert('データを取得できませんでした。')
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
  initPagination()
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

const initPagination = () => {
  pagination.innerText = `${currentNum + 1} / ${slideImageArray.length}`
}
const changePaginationIncrement = (num) => {
  pagination.innerText = `${currentNum + num} / ${slideImageArray.length}`
}
const changePaginationDecrement = (num) => {
  pagination.innerText = `${currentNum - num} / ${slideImageArray.length}`
}
