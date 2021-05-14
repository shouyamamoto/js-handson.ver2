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

const flags = {
  checkbox: false,
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
    userNameErrorMessage?.classList.remove('active')
    flags.userName = true
  } else {
    outPutErrorMessage(userName, userNameErrorMessage)
    flags.userName = false
  }

  submitBtnFlag()
})

mail.addEventListener('blur', () => {
  const inputMail = mail.value
  const result = mailCheck(inputMail)
  const mailErrorMessage = document.getElementById('mailErrorMessage')

  if (result) {
    mailErrorMessage?.classList.remove('active')
    flags.mail = true
  } else {
    outPutErrorMessage(mail, mailErrorMessage)
    flags.mail = false
  }

  submitBtnFlag()
})

password.addEventListener('blur', () => {
  const inputPassword = password.value
  const result = passwordCheck(inputPassword)
  const passwordErrorMessage = document.getElementById('passwordErrorMessage')

  if (result) {
    passwordErrorMessage?.classList.remove('active')
    flags.password = true
  } else {
    outPutErrorMessage(password, passwordErrorMessage)
    flags.password = false
  }

  submitBtnFlag()
})

/**
 * 各フォームのバリデーション
 * ユーザ名： 
    - 1文字以上、16文字未満
 * メールアドレス： softbankを参考（https://www.softbank.jp/support/faq/view/10544）
    - ひとつ目の文字は、アルファベットまたは数字のみ
    - 文字数は、3文字以上30文字以内
    - 半角英小文字、数字、「－」（ハイフン）、「．」（ドット）、「＿」（アンダーバー）のみ
 * パスワード： 
    - 8文字以上の大小の英数字を交ぜたもの
 */
const nameLength = {
  minLength: 1,
  maxLength: 15
}
const nameLengthCheck = (inputUserName) => {
  return inputUserName.length >= nameLength.minLength && inputUserName.length <= nameLength.maxLength
}

const mailRegex = /^[a-z\d][0-9a-z\.-]{2,29}@.+\..{2,}/
const mailCheck = (inputMail) => {
  return mailRegex.test(inputMail)
}

const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}/
const passwordCheck = (inputPassword) => {
  return passwordRegex.test(inputPassword)
}

// エラーメッセージの出力
const outPutErrorMessage = (inputField, argErrorMessage) => {
  if (argErrorMessage !== null) {
    argErrorMessage.classList.add('active')
  } else {
    const errorMessage = document.createElement('span')
    errorMessage.classList.add('errorMessage', 'active')

    switch (inputField) {
      case userName:
        errorMessage.id = 'userNameErrorMessage'
        errorMessage.textContent = '※ユーザ名は1文字以上、15文字以下にしてください'
        break
      case mail:
        errorMessage.id = 'mailErrorMessage'
        errorMessage.textContent = '※メールアドレスの形式になっていません'
        break
      case password:
        errorMessage.id = 'passwordErrorMessage'
        errorMessage.textContent = '※8文字以上の大小の英数字を交ぜたものにしてください'
        break
    }

    inputField.parentNode.appendChild(errorMessage)
  }
}

const modalClose = () => {
  modal.classList.remove('active')
  mask.classList.remove('active')
  closeIcon.classList.remove('active')
}

const modalOpen = () => {
  modal.classList.add('active')
  mask.classList.add('active')
  closeIcon.classList.add('active')
}

/**
 *  flagsがすべてtrueか、利用規約を最後まで読んだか を確認する関数
 *  各フォーム入力時と利用規約を最後まで読んだ時に実行
 *  全てtrueならsubmitBtnのdisabledを削除、ひとつでもfalseであればdisable付与
 */
const submitBtnFlag = () => {
  const result = Object.values(flags).every(value => value)
  if (result) {
    submitBtn.disabled = false
  } else {
    submitBtn.disabled = true
  }
}

agreeText.addEventListener('click', modalOpen)

closeIcon.addEventListener('click', modalClose)

closeBtn.addEventListener('click', modalClose)

const submitHandler = (e) => {
  e.preventDefault()
  if (checkbox.checked) {
    location.href = './register-done.html'
  }
}
submitBtn.addEventListener('click', submitHandler)

modal.onscroll = function () {
  const modalHeight = this.clientHeight
  const modalScrollHeight = this.scrollHeight
  const modalScrollTop = this.scrollTop

  if (modalScrollHeight - (modalHeight + modalScrollTop) === 0) {
    checkbox.disabled = false
    checkbox.checked = true
    flags.checkbox = true
    submitBtnFlag()
  }
}