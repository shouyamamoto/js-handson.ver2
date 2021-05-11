// modal関係
const modal = document.getElementById('js-modal')
const mask = document.getElementById('js-mask')
const checkbox = document.getElementById('js-checkbox')
const agreeText = document.getElementById('js-agreeText')
const closeIcon = document.getElementById('js-closeIcon')
const closeBtn = document.getElementById('js-closeBtn')
const submitBtn = document.getElementById('js-submitBtn')

// form関係
const userName = document.getElementById('userName')
const mail = document.getElementById('mail')
const password = document.getElementById('password')

const formFrag = {
  userName: false,
  mail: false,
  password: false
}

/**
 * 各フォームのイベント発火タイミング
 * ユーザ名： 入力時
 * メールアドレス： フォームからフォーカスが離れた時
 * パスワード： フォームからフォーカスが離れた時
 */
userName.addEventListener('input', () => {
  const inputUserName = userName.value
  const result = nameLengthCheck(inputUserName)
  const userNameErrorMessage = document.getElementById('userNameErrorMessage')

  if (result) {
    userNameErrorMessage && userNameErrorMessage.remove()
    formFrag.userName = true
  } else {
    userNameErrorMessage || errorMessage(userName)
    formFrag.userName = false
  }
})

mail.addEventListener('blur', () => {
  const inputMail = mail.value
  const result = mailCheck(inputMail)
  const mailErrorMessage = document.getElementById('mailErrorMessage')

  if (result) {
    mailErrorMessage && mailErrorMessage.remove()
    formFrag.mail = true
  } else {
    mailErrorMessage || errorMessage(mail)
    formFrag.mail = false
  }
})

password.addEventListener('blur', () => {
  const inputPassword = password.value
  const result = passwordCheck(inputPassword)
  const passwordErrorMessage = document.getElementById('passwordErrorMessage')

  if (result) {
    passwordErrorMessage && passwordErrorMessage.remove()
    formFrag.password = true
  } else {
    passwordErrorMessage || errorMessage(password)
    formFrag.password = false
  }
})

/**
 * 各フォームのバリデーション
 * ユーザ名： 
    - 16文字未満
 * メールアドレス： softbankを参考（https://www.softbank.jp/support/faq/view/10544）
    - ひとつ目の文字は、アルファベットまたは数字のみ
    - 文字数は、3文字以上30文字以内
    - 半角英小文字、数字、「－」（ハイフン）、「．」（ドット）、「＿」（アンダーバー）のみ
 * パスワード： 
    - 8文字以上の大小の英数字を交ぜたもの
 */
const nameLengthCheck = (inputUserName) => {
  const maxLength = 15
  return inputUserName.length <= maxLength
}

const mailCheck = (inputMail) => {
  const regex = /^[a-z\d][0-9a-z\.-]{2,29}@.+\..{2,}/
  const result = regex.test(inputMail)
  return result
}

const passwordCheck = (inputPassword) => {
  const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}/
  const result = regex.test(inputPassword)
  return result
}

// エラーメッセージの出力
const errorMessage = (input) => {
  const errorMessage = document.createElement('span')
  errorMessage.classList.add('errorMessage')

  switch (input) {
    case userName:
      errorMessage.id = `userNameErrorMessage`
      errorMessage.textContent = '※15文字以下にしてください'
      break
    case mail:
      errorMessage.id = `mailErrorMessage`
      errorMessage.textContent = '※メールアドレスの形式になっていません'
      break
    case password:
      errorMessage.id = `passwordErrorMessage`
      errorMessage.textContent = '※8文字以上の大小の英数字を交ぜたものにしてください'
      break
  }

  input.parentNode.appendChild(errorMessage)
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

