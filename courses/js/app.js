// ========== SUPABASE CONNECT ==========
const SUPABASE_URL = "https://wdpekgcqmwpvbfyonjih.supabase.co";
const SUPABASE_KEY = "sb_publishable_c_8MhuPqqpbgrw11AdA_ew_EK1iUlbp";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ========== TOÀN BỘ KHÓA HỌC ==========
const courses = {
  "toan-hamso": {
    id: "toan-hamso",
    title: "Toán THPT - Chuyên đề Hàm số",
    desc: "Khóa học dành cho người bắt đầu",
    price: 499000,
    oldPrice: 999000,
    badge: "hot",
    rating: 4.8,
    image: "images/toan-hamso.jpg",
    page: "course-toan-hamso.html",
    lessons: [
      {id:1,title:"Giới thiệu Hàm số",video:"https://cdn.jsdelivr.net/gh/trananhtuat/video-demo/math1.mp4"},
      {id:2,title:"Tính đơn điệu",video:"https://cdn.jsdelivr.net/gh/trananhtuat/video-demo/math2.mp4"},
      {id:3,title:"Bài tập ứng dụng",video:"https://cdn.jsdelivr.net/gh/trananhtuat/video-demo/math3.mp4"}
    ]
  },
  "hoa12-luyenthi": {
    id: "hoa12-luyenthi",
    title: "Hóa học 12 - Luyện thi đại học",
    desc: "Khóa học dành cho bạn mục tiêu cao",
    price: 299000,
    oldPrice: 799000,
    badge: "new",
    rating: 4.9,
    image: "images/hoa12.jpg",
    page: "course.html",
    lessons: [] // bạn bổ sung sau
  }
};

window.courses = courses;
window.coursesList = Object.values(courses);

// ========== RENDER KHÓA HỌC ==========
function renderCourses() {
  const grid = document.getElementById('course-list');
  if (!grid) return;

  grid.innerHTML = Object.values(courses).map(c => `
    <div class="course-card" onclick="goToDetail('${c.id}')">
      <div class="thumb">
        <img src="${c.image}" alt="${c.title}">
        ${c.badge ? `<div class="badge ${c.badge}">${c.badge==='hot'?'HOT':'NEW'}</div>` : ''}
      </div>
      <div class="info">
        <div class="rating"><span class="stars">★★★★★</span><span>${c.rating}</span></div>
        <h3 class="course-title-link">${c.title}</h3>
        <p>${c.desc}</p>
        <div>
          <span class="price">${c.price.toLocaleString()}đ</span>
          ${c.oldPrice ? `<span class="old-price">${c.oldPrice.toLocaleString()}đ</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function goToDetail(courseId){
  const course = courses[courseId];
  if (!course) return;
  const params = new URLSearchParams({title: course.title, price: course.price, orderId: "HD" + Date.now()});
  window.location.href = `checkout.html?${params}`;
}window.activateCourse = async function () {
  const codeInput = document.getElementById("activate-code");
  const msg = document.getElementById("activate-message");
  if (!codeInput || !msg) return;

  let code = codeInput.value.trim();  // bỏ space đầu cuối
  if (!code) return msg.innerHTML = "<span style='color:red'>Vui lòng nhập mã!</span>";

  msg.innerHTML = "Đang kiểm tra...";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    msg.innerHTML = "<span style='color:red'>Bạn cần đăng nhập!</span>";
    setTimeout(() => location.href = "login.html", 1500);
    return;
  }

  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
  // DÒNG QUAN TRỌNG NHẤT – BẮT DÙ CÓ SPACE, HOA/THƯỜNG
  const { data: rows, error } = await supabase
    .from('activation_codes')
    .select('*')
    .ilike('code', code);   // ← giữ nguyên, nhưng code đã được trim
  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

  console.log("Mã nhập (sau trim):", code);
  console.log("Kết quả tìm:", rows);

  if (!rows || rows.length === 0) {
    return msg.innerHTML = "<span style='color:red'>Mã không hợp lệ! (Nhập lại chính xác, không space)</span>";
  }

  const data = rows[0];

  if (data.used === true) {
    return msg.innerHTML = "<span style='color:orange'>Mã đã được sử dụng!</span>";
  }

  let myCourses = JSON.parse(localStorage.getItem("myCourses_" + user.id) || "[]");
  if (myCourses.some(c => c.id === data.course_id)) {
    return msg.innerHTML = "<span style='color:orange'>Bạn đã sở hữu khóa này rồi!</span>";
  }

  myCourses.push({ id: data.course_id, progress: 0 });
  localStorage.setItem("myCourses_" + user.id, JSON.stringify(myCourses));

  await supabase
    .from('activation_codes')
    .update({ used: true, used_at: new Date().toISOString(), used_by: user.id })
    .eq('id', data.id);

  msg.innerHTML = "<span style='color:green'>Kích hoạt thành công!</span>";
  codeInput.value = "";
  setTimeout(() => location.href = "my-courses.html", 1200);
};
// ========== MỞ & ĐÓNG POPUP ==========
window.openActivatePopup = async function () {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    if (confirm("Bạn cần đăng nhập để kích hoạt mã. Đi đến trang đăng nhập ngay?")) {
      window.location.href = "login.html";
    }
    return;
  }

  const popup = document.getElementById("activate-popup");
  if (popup) {
    popup.style.display = "flex";
    document.getElementById("activate-code").value = "";
    document.getElementById("activate-message").textContent = "";
    document.getElementById("activate-code").focus();
  }
};

window.closeActivatePopup = function () {
  const popup = document.getElementById("activate-popup");
  if (popup) popup.style.display = "none";
};

// ========== AUTH HEADER ==========
async function initAuth() {
  const { data: { user } } = await supabase.auth.getUser();

  if (window.location.pathname.includes("login.html") && user) {
    window.location.href = "index.html";
    return;
  }

  const wrap = document.getElementById("header-user");
  if (!wrap) return;

  if (user) {
    const avatar = user.user_metadata?.avatar_url || "images/default-avatar.png";
    wrap.innerHTML = `
      <div class="relative group">
        <img src="${avatar}" class="w-10 h-10 rounded-full cursor-pointer" title="Đăng xuất" onclick="logout()"/>
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block z-50">
          <div class="px-4 py-2 text-sm text-gray-700 border-b">${user.email}</div>
          <button onclick="logout()" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Đăng xuất</button>
        </div>
      </div>`;
  } else {
    wrap.innerHTML = `<a class="btn-login" href="login.html">Đăng nhập</a>`;
  }
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

// ========== KHỞI ĐỘNG ==========
async function initPage() {
  await initAuth();
  renderCourses();
}

document.addEventListener("DOMContentLoaded", initPage);