const topBtn = document.getElementById('js-topBtn')
const tab = document.getElementById('js-tab')

const toggleActive = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      topBtn.classList.add('active')
    } else {
      topBtn.classList.remove('active')
    }
  })
}
const observer = new IntersectionObserver(toggleActive)
observer.observe(tab)

topBtn.addEventListener('click', scrollTop)

function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
