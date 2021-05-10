const modal = document.getElementById('js-modal')
const mask = document.getElementById('js-mask')
const checkbox = document.getElementById('js-checkbox')
const agreeText = document.getElementById('js-agreeText')
const closeIcon = document.getElementById('js-closeIcon')
const closeBtn = document.getElementById('js-closeBtn')
const submitBtn = document.getElementById('js-submitBtn')
const userName = document.getElementById('userName')

userName.addEventListener('input', () => {
  const inputUserName = userName.value
  const result = nameLengthCheck(inputUserName)
  const errorMessage = document.getElementById('userNameErrorMessage')

  if (result) {
    errorMessage && errorMessage.remove()
  } else {
    errorMessage || errorMessageShow()
  }
})

const errorMessageShow = () => {
  const errorMessage = document.createElement('span')
  errorMessage.textContent = '※15文字以下にしてください'
  errorMessage.classList.add('errorMessage')
  errorMessage.id = 'userNameErrorMessage'
  userName.parentNode.appendChild(errorMessage)
}

const nameLengthCheck = (inputUserName) => {
  const maxLength = 16
  return inputUserName.length < maxLength
}

agreeText.addEventListener('click', modalOpen)

closeIcon.addEventListener('click', modalClose)

closeBtn.addEventListener('click', modalClose)

submitBtn.addEventListener('click', (e) => {
  e.preventDefault()
  if (checkbox.checked) {
    location.href = './register-done.html'
  } else {
    alert('利用規約を最後まで読んでから送信ボタンを押してください')
  }
})

modal.onscroll = function () {
  const modalHeight = this.clientHeight
  const modalScrollHeight = this.scrollHeight
  const modalScrollTop = this.scrollTop

  if (modalScrollHeight - (modalHeight + modalScrollTop) === 0) {
    checkbox.disabled = false
    checkbox.checked = true
    submitBtn.disabled = false
  }
}

function modalClose() {
  modal.classList.remove('active')
  mask.classList.remove('active')
  closeIcon.classList.remove('active')
}

function modalOpen() {
  modal.classList.add('active')
  mask.classList.add('active')
  closeIcon.classList.add('active')
}

