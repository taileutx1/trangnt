// ================= SUPABASE ================= (giả sử supabase đã init ở đâu đó)

// ================= RENDER COURSES =================
function renderCourses(coursesList) {
  document.getElementById("courses-grid").innerHTML = coursesList.map(c => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <img src="${c.image}" alt="${c.title}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="text-xl font-semibold mb-2">${c.title}</h3>
        <p class="text-gray-600 mb-4">${c.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold text-green-600">${c.price.toLocaleString()}đ</span>
          <button onclick="goCheckout(${c.id})" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function goCheckout(id) {
  const c = courses.find(x => x.id === id);
  if (!c) return;
  const params = new URLSearchParams({
    title: c.title,
    price: c.price,
    orderId: "HD" + Date.now()
  });
  location.href = "checkout.html?" + params;
}

// ================= SEARCH =================
document.addEventListener("input", e => {
  if (e.target.id !== "search-input") return;
  const q = e.target.value.toLowerCase();
  renderCourses(courses.filter(c => c.title.toLowerCase().includes(q)));
});

// ================= ACTIVATE COURSE =================
window.activateCourse = async function () {
  const code = document.getElementById("activate-code").value.trim();
  const msg = document.getElementById("activate-message");
  msg.innerHTML = "";

  if (!code) {
    msg.innerHTML = "<span class='text-red-500'>Vui lòng nhập mã!</span>";
    return;
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    location.href = "login.html";
    return;
  }

  try {
    // Update nguyên tử: chỉ update nếu code đúng và chưa used
    const { data, error, count } = await supabase
      .from("activation_codes")
      .update({ used: true })
      .eq("code", code)  // exact match code (nên dùng eq thay ilike cho code)
      .eq("used", false)
      .select("course_id")  // select chỉ course_id cần thiết
      .single();  // mong đợi đúng 1 row

    if (error || !data) {
      // Nếu error hoặc không update được (count = 0)
      msg.innerHTML = "<span class='text-red-500'>Mã không hợp lệ hoặc đã được sử dụng</span>";
      return;
    }

    // Lấy danh sách khóa học đã sở hữu
    let my = JSON.parse(localStorage.getItem("myCourses_" + user.id) || "[]");

    if (my.some(x => x.id === data.course_id)) {
      msg.innerHTML = "<span class='text-orange-500'>Bạn đã sở hữu khóa học này rồi</span>";
      return;
    }

    // Thêm khóa học mới
    my.push({ id: data.course_id, progress: 0 });
    localStorage.setItem("myCourses_" + user.id, JSON.stringify(my));

    msg.innerHTML = "<span class='text-green-600'>Kích hoạt thành công!</span>";
    setTimeout(() => location.href = "my-courses.html", 1200);

  } catch (err) {
    console.error(err);
    msg.innerHTML = "<span class='text-red-500'>Đã có lỗi xảy ra, vui lòng thử lại</span>";
  }
};

// ================= POPUP =================
window.openActivatePopup = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return location.href = "login.html";
  document.getElementById("activate-popup").style.display = "flex";
};

window.closeActivatePopup = () => document.getElementById("activate-popup").style.display = "none";

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadCourses);