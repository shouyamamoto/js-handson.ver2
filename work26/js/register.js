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

const validationState = {
  checkbox: false,
  userName: false,
  mail: false,
  password: false
}
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
const formSpecifications = {
  name: {
    minLength: 1,
    maxLength: 15
  },
  mail: {
    regex: /^[a-z\d][0-9a-z.-]{2,29}@.+\..{2,}/
  },
  password: {
    regex: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}/
  }
}

const nameLengthCheck = (inputUserName) => {
  const { name: { minLength, maxLength } } = formSpecifications
  return inputUserName.length >= minLength && inputUserName.length <= maxLength
}

const mailCheck = (inputMail) => {
  const { mail: { regex } } = formSpecifications
  return regex.test(inputMail)
}

const passwordCheck = (inputPassword) => {
  const { password: { regex } } = formSpecifications
  return regex.test(inputPassword)
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

/**
 *  validationStateがすべてtrueか、利用規約を最後まで読んだか を確認する関数
 *  各フォーム入力時と利用規約を最後まで読んだ時に実行
 *  全てtrueならsubmitBtnのdisabledを削除、ひとつでもfalseであればdisable付与
 */
const submitBtnFlag = () => {
  const result = Object.values(validationState).every(value => value)
  if (result) {
    submitBtn.disabled = false
  } else {
    submitBtn.disabled = true
  }
}

/**
 * 各フォームのイベント発火タイミング
 * ユーザ名： 入力時
 * メールアドレス： フォームからフォーカスが離れた時
 * パスワード： フォームからフォーカスが離れた時
 */
const formEventHandler = (inputArea, applyErrorMessage, callbackValid, key) => {
  const inputValue = inputArea.value
  const result = callbackValid(inputValue)
  const errorMessage = document.getElementById(applyErrorMessage)

  if (result) {
    errorMessage?.classList.remove('active')
    validationState[key] = true
  } else {
    outPutErrorMessage(inputArea, errorMessage)
    validationState[key] = false
  }

  submitBtnFlag()
}

userName.addEventListener(
  'blur',
  () => formEventHandler(userName, 'userNameErrorMessage', nameLengthCheck, 'userName')
)

mail.addEventListener(
  'blur',
  () => formEventHandler(mail, 'mailErrorMessage', mailCheck, 'mail')
)

password.addEventListener(
  'blur',
  () => formEventHandler(password, 'passwordErrorMessage', passwordCheck, 'password')
)


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
    validationState.checkbox = true
    submitBtnFlag()
  }
}