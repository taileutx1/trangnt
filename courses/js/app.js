const API = "courses.json"

let courses = []
let currentPage = 1
let perPage = 6
let keyword = ""

async function load() {
  const res = await fetch(API)
  courses = await res.json()
  render()
}

function filter() {
  return courses.filter(c =>
    c.title.toLowerCase().includes(keyword) ||
    c.describe.toLowerCase().includes(keyword)
  )
}

function paginate(data) {
  const start = (currentPage - 1) * perPage
  return data.slice(start, start + perPage)
}

function render() {
  const data = filter()
  document.getElementById("result-count").innerText =
    `${data.length} khóa học`

  document.getElementById("course-list").innerHTML =
    paginate(data).map(c => `
      <a href="course-detail.html?id=${c.id}" class="course-card"> </a>

        <div class="thumb">
          <img src="${c.thumbnail}">
        </div>
        <div class="info">
          <h3>${c.title}</h3>
          <p class="muted">${c.describe}</p>
          <div class="price">${c.price}</div>
        </div>
      </div>
    `).join('')

  renderPagination(data.length)
}

function renderPagination(total) {
  let pages = Math.ceil(total / perPage)
  let html = ""

  for(let i=1;i<=pages;i++){
    html += `
      <button class="page-btn ${i===currentPage?'active':''}"
        onclick="go(${i})">${i}</button>
    `
  }
  document.getElementById("pagination").innerHTML = html
}

function go(p){
  currentPage = p
  render()
}




load()
