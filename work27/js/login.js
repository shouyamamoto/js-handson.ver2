// DOM取得
const loginBtn = document.getElementById('js-loginBtn')
const userName = document.getElementById('userName')
const password = document.getElementById('password')
const userNameErrorMessage = document.getElementById('userNameErrorMessage')
const passwordErrorMessage = document.getElementById('passwordErrorMessage')

const users = [
  {
    name: 'aaaa',
    password: 'Yamamoto0000'
  },
  {
    name: 'bbbb',
    password: 'Yamamoto1111'
  }
]

const loginHandler = async (e) => {
  e.preventDefault()
  const inputUserData = {
    name: userName.value,
    password: password.value,
  }

  let result
  try {
    const token = await checkSubmitData(inputUserData)
    result = true
    setLocalStorage(token)
  } catch {
    result = false
  } finally {
    changeLocation(result)
  }
}
loginBtn.addEventListener('click', loginHandler)


const checkSubmitData = (inputUserData) => {
  return new Promise((resolve, reject) => {
    const result = users.some(user =>
      user.name === inputUserData.name && user.password === inputUserData.password
    )
    if (result) {
      resolve("far0fja*ff]afaawfqrlzkfq@aq9283af")
    } else {
      reject()
    }
  })
}

const setLocalStorage = (publishedToken) => {
  localStorage.setItem('token', publishedToken)
}
const changeLocation = (result) => {
  result ? location.href = './contents.html' : location.href = './failure.html'
}

/**
 * 以下バリデーション関係
**/
const currentErrorState = {
  userName: false,
  password: false
}

const loginFormSpecifications = {
  name: {
    minLength: 1,
    maxLength: 15
  },
  password: {
    regex: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}/
  }
}

const nameLengthCheck = (inputUserName) => {
  const { name: { minLength, maxLength } } = loginFormSpecifications
  return inputUserName.length >= minLength && inputUserName.length <= maxLength
}

const passwordCheck = (inputPassword) => {
  const { password: { regex } } = loginFormSpecifications
  return regex.test(inputPassword)
}

const loginBtnFrag = () => {
  const result = Object.values(currentErrorState).every(value => value)
  if (result) {
    loginBtn.disabled = false
  } else {
    loginBtn.disabled = true
  }
}

const blurEventHandler = (key, callbackValid, inputArea, errorMessage) => {
  if (callbackValid(inputArea.value)) {
    errorMessage.classList.remove('active')
    currentErrorState[key] = true
  } else {
    errorMessage.classList.add('active')
    currentErrorState[key] = false
  }

  loginBtnFrag()
}

userName.addEventListener(
  'blur',
  () => blurEventHandler('userName', nameLengthCheck, userName, userNameErrorMessage)
)
password.addEventListener(
  'blur',
  () => blurEventHandler('password', passwordCheck, password, passwordErrorMessage)
)