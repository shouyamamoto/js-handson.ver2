const fetchUsersURL = "https://jsondata.okiba.me/v1/json/kscum210503062703"

const userTable = document.getElementById('userTable')
const requiredColumns = ["id", "name", "sex", "age"] // 表示したいカラム

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
    }, 100)
  })
}

const createUserTable = async () => {
  const userData = await fetchUserData()
  const users = await userData.users
  createColumn(users)
  createUsers(users)
}
createUserTable()

// カラムを生成する処理
function createColumn(users) {
  const columnFragment = document.createDocumentFragment()
  const columnTr = document.createElement('tr')
  let columns = []
  columns = checkColumn(users, columns)
  columnTr.classList.add('t-head')
  columns.forEach(column => {
    const columnTh = document.createElement('th')
    columnTh.textContent = changeColumnName(column)
    columnFragment.appendChild(columnTh)
  })
  columnTr.appendChild(columnFragment)
  userTable.appendChild(columnTr)
}

// 表示したいカラムと、userが持っているkeysが同じかをチェックする
function checkColumn(users, columns) {
  users.forEach(user => {
    const userKeys = Object.keys(user)
    if (userKeys.toString === requiredColumns.toString) { // 表示したいカラムと、userが持っているkeysが同じであればそれをcolumnへ
      columns = userKeys
    }
  })
  return columns
}

// ユーザが持っているkeyを表示したいカラム名に変換して返す
function changeColumnName(column) {
  if (column === 'id') {
    return 'ID'
  } else if (column === 'name') {
    return '名前'
  } else if (column === 'age') {
    return '年齢'
  } else if (column === 'sex') {
    return '性別'
  }
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
