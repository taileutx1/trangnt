// Common helper functions
async function fetchCourses() {
  const res = await fetch('courses.json');
  if(!res.ok) throw new Error('Không tải được courses.json');
  return await res.json();
}

function q(sel){return document.querySelector(sel)}
function qAll(sel){return Array.from(document.querySelectorAll(sel))}

// Get query param
function getParam(name){ return new URLSearchParams(location.search).get(name); }

/* -------------------------------
   Course list + search + pagination
   ------------------------------- */
async function renderCourseList({page=1, perPage=6, search=''} = {}) {
  const courses = await fetchCourses();
  const filtered = courses.filter(c => {
    const s = search.trim().toLowerCase();
    if(!s) return true;
    return c.title.toLowerCase().includes(s) 
      || (c.instructor && c.instructor.toLowerCase().includes(s));
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total/perPage));
  page = Math.min(Math.max(1, page), totalPages);

  const start = (page-1)*perPage;
  const pageItems = filtered.slice(start, start+perPage);

  const grid = q('#courses-grid');
  grid.innerHTML = pageItems.map(c => `
    <div class="card">
      <img src="${c.image}" alt="${c.title}" onerror="this.src='https://via.placeholder.com/160x90?text=No+Image'">
      <div class="meta">
        <div class="title"><a href="course-detail.html?id=${encodeURIComponent(c.id)}">${c.title}</a></div>
        <div class="small">Giảng viên: ${c.instructor} • ${c.members} học viên</div>
        <div style="margin-top:8px;"><span class="badge">${c.rating} ★</span></div>
      </div>
    </div>
  `).join('');

  // Pagination
  const pag = q('#pagination');
  let pagesHtml = '';
  for(let i=1;i<=totalPages;i++){
    pagesHtml += `<button data-page="${i}" class="page-btn ${i===page?'active':''}">${i}</button>`;
  }
  pag.innerHTML = pagesHtml;

  qAll('#pagination .page-btn').forEach(b=>{
    b.addEventListener('click', ()=> {
      renderCourseList({page: Number(b.dataset.page), perPage, search});
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });

  // Info
  q('#result-info').textContent = `${total} khóa học`;
}

/* -------------------------------
   Course detail (reads id from URL)
   ------------------------------- */
async function renderCourseDetail() {
  const id = getParam('id') || 'toan';
  const courses = await fetchCourses();
  const course = courses.find(c => c.id===id) || courses[0];

  q('#course-title').textContent = course.title;
  q('#course-img').src = course.image;
  q('#course-info').innerHTML = `<i class="fas fa-star" style="color:gold"></i> ${course.rating} (${course.reviews} đánh giá) • ${course.members} học viên • Cập nhật: ${course.lastUpdate}`;

  // lessons
  const container = q('#lessons');
  container.innerHTML = '';
  course.lessons.forEach(les => {
    const icon = les.type==="file" ? "far fa-file-alt" :
                les.type==="folder" ? "fas fa-folder" :
                les.type==="playlist" ? "fas fa-play-circle" :
                "fab fa-youtube";
    const el = document.createElement('div');
    el.className = 'section';
    el.innerHTML = `
      <div class="section-head">
        <div><i class="${icon}"></i> <strong>${les.title}</strong> ${les.detail?`<small class="small"> ${les.detail}</small>`:''}</div>
        <div>
          ${les.new?'<span class="badge">New</span>':''}
        </div>
      </div>
      ${les.quiz?`<div class="lesson"><div><i class="fas fa-tasks"></i> Quiz cuối chương</div><div><button class="btn">Xem quiz</button></div></div>`:''}
    `;
    container.appendChild(el);
  });
}

/* -------------------------------
   Admin view - single course edit view
   ------------------------------- */
async function renderCourseAdmin() {
  const id = getParam('id') || 'toan';
  const courses = await fetchCourses();
  const course = courses.find(c => c.id===id) || courses[0];

  q('#admin-course-title').textContent = course.title;
  q('#admin-course-img').src = course.image;
  q('#admin-stats').textContent = `${course.rating} (${course.reviews} đánh giá) • ${course.members} học viên`;

  const container = q('#admin-sections');
  container.innerHTML = '';
  course.lessons.forEach((s, idx) => {
    const div = document.createElement('div');
    div.className = 'section';
    div.innerHTML = `
      <div class="section-head">
        <div><strong>${s.title}</strong> ${s.detail?`<small class="small"> ${s.detail}</small>`:''}</div>
        <div>
          ${s.new?'<span class="badge">New</span>':''}
          <button class="btn ghost" data-idx="${idx}" data-action="edit">Edit</button>
          <button class="btn ghost" data-idx="${idx}" data-action="delete">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  // Note: admin actions are UI-only (no write-back to JSON in static hosting)
  container.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const idx = Number(btn.dataset.idx);
    const action = btn.dataset.action;
    if(action==='delete'){
      if(confirm('Xóa mục này (UI-only, file JSON không thay đổi trên hosting)?')){
        container.children[idx].remove();
      }
    } else if(action==='edit'){
      alert('Chức năng chỉnh sửa đang là demo. Để lưu thực tế cần backend hoặc local edit.');
    }
  });
}

/* -------------------------------
   Entry point: detect which page
   ------------------------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  const page = document.body.dataset.page;
  if(page==='list'){
    // initial render with search + pagination
    const searchInput = q('#search-input');
    const perPageSelect = q('#per-page');
    // render
    const options = {page:1, perPage: Number(perPageSelect.value), search: searchInput.value};
    renderCourseList(options);
    // events
    searchInput.addEventListener('input', ()=> renderCourseList({page:1, perPage: Number(perPageSelect.value), search: searchInput.value}));
    perPageSelect.addEventListener('change', ()=> renderCourseList({page:1, perPage: Number(perPageSelect.value), search: searchInput.value}));
  } else if(page==='detail'){
    renderCourseDetail();
  } else if(page==='admin'){
    renderCourseAdmin();
  }
});