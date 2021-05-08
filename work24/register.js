const modal = document.getElementById('js-modal')
const mask = document.getElementById('js-mask')
const checkbox = document.getElementById('js-checkbox')
const agreeText = document.getElementById('js-agreeText')
const closeIcon = document.getElementById('js-closeIcon')
const closeBtn = document.getElementById('js-closeBtn')
const submitBtn = document.getElementById('js-submitBtn')

agreeText.addEventListener('click', () => {
  modalOpen()
})

closeIcon.addEventListener('click', () => {
  modalClose()
})

closeBtn.addEventListener('click', () => {
  modalClose()
})

submitBtn.addEventListener('click', (e) => {
  e.preventDefault()
  if (checkbox.checked) {
    location.href = './register-done.html'
  } else {
    alert('利用規約を最後まで読んでから送信ボタンを押してください')
  }
})

modal.onscroll = function () {
  const modalHeight = modal.clientHeight
  const modalScrollHeight = modal.scrollHeight
  const modalScrollTop = modal.scrollTop

  if (modalScrollHeight - (modalHeight + modalScrollTop) === 0) {
    checkbox.disabled = false
    checkbox.checked = true
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