const fetchUsersURL = "https://jsondata.okiba.me/v1/json/g0Ew3210429224626"

const userTable = document.getElementById('userTable')

const myFetch = async (fetchUsersURL) => {
  try {
    const res = await fetch(fetchUsersURL)
    const data = await res.json()
    return data
  } catch {
    userTable.textContent = 'データを取得できませんでした'
  } finally {
    console.log('myFetch executed')
  }
}

const fetchUserData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(myFetch(fetchUsersURL))
    }, 3000)
  })
}

const createUserTable = async () => {
  const userData = await fetchUserData()
  const userDataFragment = document.createDocumentFragment()

  const tr = document.createElement('tr')
  const thId = document.createElement('th')
  const thName = document.createElement('th')
  const thSex = document.createElement('th')
  const thAge = document.createElement('th')
  tr.classList.add('t-head')
  thId.textContent = 'ID'
  thName.textContent = '名前'
  thSex.textContent = '性別'
  thAge.textContent = '年齢'
  tr.appendChild(thId)
  tr.appendChild(thName)
  tr.appendChild(thSex)
  tr.appendChild(thAge)

  userData.users.forEach(user => {
    const tr = document.createElement('tr')
    const tdId = document.createElement('td')
    const tdName = document.createElement('td')
    const tdSex = document.createElement('td')
    const tdAge = document.createElement('td')

    tdId.textContent = user.id
    tdName.textContent = user.name
    tdSex.textContent = user.sex
    tdAge.textContent = user.age

    tr.appendChild(tdId)
    tr.appendChild(tdName)
    tr.appendChild(tdSex)
    tr.appendChild(tdAge)

    userDataFragment.appendChild(tr)
  })

  userTable.appendChild(tr)
  userTable.appendChild(userDataFragment)
}
createUserTable()