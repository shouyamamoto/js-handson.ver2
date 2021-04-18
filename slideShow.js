// json取得先
const fetchURL = 'https://jsondata.okiba.me/v1/json/IOQ9t210418034754'

const slideShowContainer = document.getElementById('js-slideShow')
slideShowContainer.classList.add('slideShowContainer')

const myFetch = async (fetchURL) => {
  try {
    const res = await fetch(fetchURL)
    const data = res.json()
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
    }, 100)
  })
}

const createSlide = async () => {
  const imagePaths = await fetchSlideShowImages()
  createImageList(imagePaths)
}
createSlide()

const createImageList = (imagePaths) => {
  const imageListFrag = document.createDocumentFragment()

  imagePaths.images.map(image => {
    const li = document.createElement('li')
    const img = document.createElement('img')
    img.classList.add('slideImage')
    if (image.init) {
      img.classList.add('active')
    }
    img.src = image.imgPath
    li.appendChild(img)
    imageListFrag.appendChild(li)
  })

  slideShowContainer.appendChild(imageListFrag)
}