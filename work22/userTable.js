const fetchUsersURL = "https://jsondata.okiba.me/v1/json/mMhP9210504160147"

const userTable = document.getElementById('userTable')
const requiredColumns = ["id", "name", "sex", "age"] // 表示したいカラム

const sortArrows = {
  asc: './images/asc.svg',
  both: './images/both.svg',
  desc: './images/desc.svg'
}

const sortStates = {
  id: 'BOTH',
  age: 'BOTH'
}

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
  addSortArrowForTh('id', users)
  addSortArrowForTh('age', users)
  createUsers(users)
}
createUserTable()

// カラムを生成する処理
function createColumn() {
  const columnFragment = document.createDocumentFragment()
  const columnTr = document.createElement('tr')
  columnTr.classList.add('t-head')

  requiredColumns.forEach(column => {
    const columnTh = document.createElement('th')
    columnTh.id = column
    columnTh.textContent = changeColumnName(column)
    columnFragment.appendChild(columnTh)
  })

  columnTr.appendChild(columnFragment)
  userTable.appendChild(columnTr)
}

// thにsortArrowを追加する
function addSortArrowForTh(key, users) {
  const arrowImg = document.createElement('img')
  const sortElement = document.getElementById(key)
  arrowImg.src = sortArrows.both
  arrowImg.classList.add('sortArrow')
  arrowImg.id = `${key}Arrow`
  sort(users, arrowImg, key)
  sortElement.appendChild(arrowImg)
}

// ソートする関数
function sort(users, arrowImg, key) {
  arrowImg.addEventListener('click', () => {
    sortUsers = [...users]
    resetSort(key)

    if (sortStates[key] === 'BOTH') {
      sortStates[key] = 'ASC'
      sortUsers.sort(sortAsc(key))
      arrowImg.src = sortArrows.asc
    } else if (sortStates[key] === 'ASC') {
      sortStates[key] = 'DESC'
      sortUsers.sort(sortDesc(key))
      arrowImg.src = sortArrows.desc
    } else if (sortStates[key] === 'DESC') {
      sortStates[key] = 'BOTH'
      arrowImg.src = sortArrows.both
    }
    const targetChildren = document.querySelectorAll('.user')
    targetChildren.forEach(targetChild => {
      userTable.removeChild(targetChild)
    })
    createUsers(sortUsers)
  })
}

function resetSort(key) {
  const _arrowReset = (resetTargetKey) => {
    resetTargetArrow = document.getElementById(`${resetTargetKey}Arrow`)
    resetTargetArrow.src = sortArrows.both
    sortStates[resetTargetKey] = 'BOTH'
  }

  switch (key) {
    case "id":
      _arrowReset('age');
      break
    case "age":
      _arrowReset('id');
      break
  }
}

function sortDesc(key) {
  return (a, b) => {
    if (a[key] > b[key]) return -1
    if (a[key] < b[key]) return 1
    return 0
  }
}
function sortAsc(key) {
  return (a, b) => {
    if (a[key] < b[key]) return -1
    if (a[key] > b[key]) return 1
    return 0
  }
}

// 表示したいカラム名に変換して返す
function changeColumnName(column) {
  switch (column) {
    case "id":
      return "ID";
    case "name":
      return "名前";
    case "age":
      return "年齢";
    case "sex":
      return "性別";
    default:
      console.error(`not provided ${column}`);
  }
}

// ユーザを生成する処理
function createUsers(users) {
  const userDataFragment = document.createDocumentFragment()
  users.forEach(user => {
    const tr = document.createElement('tr')
    tr.classList.add('user')
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
