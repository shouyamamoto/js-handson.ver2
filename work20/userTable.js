const fetchUsersURL = "https://jsondata.okiba.me/v1/json/XWziO210503032750"

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
  const { users, columns } = userData
  createColumn(columns)
  createUsers(users)
}
createUserTable()

// カラムを生成する処理
function createColumn(columns) {
  const columnFragment = document.createDocumentFragment()
  const columnTr = document.createElement('tr')
  columnTr.classList.add('t-head')

  columns.forEach(column => {
    const columnTh = document.createElement('th')
    columnTh.textContent = column
    columnFragment.appendChild(columnTh)
  })

  columnTr.appendChild(columnFragment)
  userTable.appendChild(columnTr)
}

// ユーザを生成する処理
function createUsers(users) {
  const userDataFragment = document.createDocumentFragment()

  users.forEach(user => {
    const tr = document.createElement('tr')
    const tdId = document.createElement('td')
    const tdName = document.createElement('td')
    const tdSex = document.createElement('td')
    const tdAge = document.createElement('td')

    const { id, name, sex, age } = user
    tdId.textContent = id
    tdName.textContent = name
    tdSex.textContent = sex
    tdAge.textContent = age

    tr.appendChild(tdId)
    tr.appendChild(tdName)
    tr.appendChild(tdSex)
    tr.appendChild(tdAge)

    userDataFragment.appendChild(tr)
  })
  userTable.appendChild(userDataFragment)
}