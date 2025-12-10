
const courses = [
  {
    id: "toan-hamso",
    title: "Toán THPT - Chuyên đề Hàm số",
    desc: "Khóa học dành cho người bắt đầu",
    price: 499000,
    oldPrice: 999000,
    badge: "hot",
    rating: 4.8,
    image: "images/toan-hamso.jpg"
  },
  {
    id: "hoa12-luyenthi",
    title: "Hóa học 12 - Luyện thi đại học",
    desc: "Khóa học dành cho bạn mục tiêu cao",
    price: 299000,
    oldPrice: 799000,
    badge: "new",
    rating: 4.9,
    image: "images/hoa12.jpg"
  },
  // thêm thoải mái...
];

function renderCourses() {
  const grid = document.getElementById('course-list');
  grid.innerHTML = courses.map(c => `
    <div class="course-card" onclick="goToDetail('${c.id}')">
      <div class="thumb">
        <img src="${c.image}" alt="${c.title}">
        ${c.badge ? `<div class="badge ${c.badge}">${c.badge === 'hot' ? 'HOT' : 'NEW'}</div>` : ''}
      </div>
      <div class="info">
        <div class="rating">
          <span class="stars">★★★★★</span>
          <span>${c.rating}</span>
        </div>
        <h3 class="course-title-link">${c.title}</h3>
        <p>${c.desc}</p>
        <div>
          <span class="price">${c.price.toLocaleString()}đ</span>
          ${c.oldPrice ? `<span class="old-price">${c.oldPrice.toLocaleString()}đ</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('result-count').textContent = `${courses.length} khóa học`;
}

function goToDetail(courseId) {
  // Tìm khóa học theo id
  const course = courses.find(c => c.id === courseId);
  if (course) {
    // Chuyển sang checkout.html và truyền dữ liệu qua URL
    const params = new URLSearchParams({
      title: course.title,
      price: course.price,
      orderId: "HD" + Date.now() + "_" + Math.floor(Math.random() * 10000) // tạo mã ngẫu nhiên đẹp
    });
    window.location.href = `checkout.html?${params.toString()}`;
  }
}

renderCourses();