if (localStorage.getItem('token')) {
  location.href = './contents.html'
} else {
  location.href = './login.html'
}