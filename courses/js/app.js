// js/app.js
const SUPABASE_URL = "https://wdpekgcqmwpvbfyonjih.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkcGVrZ2NxbXdwdmJmeW9uamloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODk4NjUsImV4cCI6MjA4MDk2NTg2NX0.qaIDzIZsGSifXO8PKM2jDAx7E6Earv2K7iFPQ8GqqaU";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cập nhật giao diện người dùng
async function updateUserUI() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  const elements = {
    desktopLogin: document.getElementById('desktop-login-btn'),
    mobileLogin: document.getElementById('mobile-login-btn'),
    desktopUserInfo: document.getElementById('desktop-user-info'),
    mobileUserInfo: document.getElementById('mobile-user-info'),
    mobileUserMenu: document.getElementById('mobile-user-menu'),
    desktopUsername: document.getElementById('desktop-username'),
    desktopEmail: document.getElementById('desktop-email'),
    mobileUsername: document.getElementById('mobile-username'),
    desktopAvatar: document.getElementById('desktop-user-avatar'),
    mobileAvatar: document.getElementById('mobile-user-avatar'),
  };

  if (!user) {
    elements.desktopLogin?.classList.remove('hidden');
    elements.mobileLogin?.classList.remove('hidden');
    elements.desktopUserInfo?.classList.add('hidden');
    elements.mobileUserInfo?.classList.add('hidden');
    elements.mobileUserMenu?.classList.add('hidden');
    return;
  }

  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
  const email = user.email;
  const avatar = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ec4899&color=fff&bold=true`;

  elements.desktopLogin?.classList.add('hidden');
  elements.mobileLogin?.classList.add('hidden');
  elements.desktopUserInfo?.classList.remove('hidden');
  elements.mobileUserInfo?.classList.remove('hidden');
  elements.mobileUserMenu?.classList.remove('hidden');

  elements.desktopUsername.textContent = name;
  elements.desktopEmail.textContent = email;
  elements.mobileUsername.textContent = name;
  elements.desktopAvatar.src = avatar;
  elements.mobileAvatar.src = avatar;
}

// Các hàm hỗ trợ
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.hamburger');
  menu.classList.toggle('hidden');
  hamburger.classList.toggle('active');
}

function toggleDropdown() {
  document.getElementById('desktop-dropdown').classList.toggle('hidden');
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.reload();
}

function openActivateModal() {
  const modal = document.getElementById('activate-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  document.getElementById('activate-code').focus();
}

function closeActivateModal() {
  const modal = document.getElementById('activate-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
  document.getElementById('activate-code').value = '';
  document.getElementById('activate-message').textContent = '';
}

async function activateCode() {
  const code = document.getElementById('activate-code').value.trim();
  const msg = document.getElementById('activate-message');

  if (!code) {
    msg.textContent = 'Vui lòng nhập mã kích hoạt!';
    msg.className = 'text-sm mb-4 text-red-500 min-h-[20px]';
    return;
  }

  msg.textContent = 'Đang kiểm tra mã...';
  msg.className = 'text-sm mb-4 text-gray-600 min-h-[20px]';

  try {
    const { data, error } = await supabaseClient.rpc('activate_course_code', { p_code: code });

    if (error) throw error;

    let result = 'UNKNOWN_ERROR';
    if (typeof data === 'string') result = data.trim().toUpperCase();
    else if (data && typeof data === 'object') {
      const keys = Object.keys(data);
      const key = keys.find(k => k.toLowerCase().includes('result') || k.toLowerCase().includes('activate')) || keys[0];
      result = (data[key] || '').toString().trim().toUpperCase();
    }

    switch (result) {
      case 'SUCCESS':
        msg.textContent = '🎉 Kích hoạt thành công! Đang chuyển...';
        msg.className = 'text-sm mb-4 text-green-600 font-bold min-h-[20px]';
        setTimeout(() => {
          closeActivateModal();
          window.location.href = 'my-courses.html';
        }, 1500);
        break;
      case 'NOT_LOGGED_IN':
        msg.textContent = 'Bạn cần đăng nhập trước!';
        setTimeout(() => {
          closeActivateModal();
          window.location.href = 'login.html';
        }, 2000);
        break;
      case 'INVALID_CODE':
        msg.textContent = 'Mã kích hoạt không hợp lệ!';
        msg.className = 'text-sm mb-4 text-red-500 min-h-[20px]';
        break;
      case 'CODE_USED':
        msg.textContent = 'Mã này đã được sử dụng!';
        msg.className = 'text-sm mb-4 text-red-500 min-h-[20px]';
        break;
      default:
        msg.textContent = 'Lỗi không xác định. Liên hệ hỗ trợ.';
        msg.className = 'text-sm mb-4 text-red-500 min-h-[20px]';
    }
  } catch (err) {
    msg.textContent = 'Lỗi kết nối, vui lòng thử lại!';
    msg.className = 'text-sm mb-4 text-red-500 min-h-[20px]';
  }
}

function filterCourses() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const cards = document.querySelectorAll('#course-list > a');
  let visible = 0;

  cards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    if (title.includes(query)) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  document.getElementById('empty-state').classList.toggle('hidden', visible > 0);
}

async function goMyCourses() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  window.location.href = user ? 'my-courses.html' : 'login.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();

  // Mobile menu
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', toggleMobileMenu);

  // Dropdown
  document.getElementById('desktop-dropdown-toggle')?.addEventListener('click', toggleDropdown);

  // Buttons
  document.getElementById('my-courses-btn')?.addEventListener('click', goMyCourses);
  document.getElementById('mobile-my-courses-btn')?.addEventListener('click', () => {
    goMyCourses();
    toggleMobileMenu();
  });

  document.querySelectorAll('#activate-btn, #mobile-activate-btn').forEach(btn => {
    btn.addEventListener('click', openActivateModal);
  });

  document.getElementById('activate-submit')?.addEventListener('click', activateCode);
  document.getElementById('activate-cancel')?.addEventListener('click', closeActivateModal);

  document.querySelectorAll('#logout-btn-desktop, #logout-btn-mobile').forEach(btn => {
    btn.addEventListener('click', logout);
  });

  document.getElementById('search-input')?.addEventListener('input', filterCourses);

  // Đóng modal khi click ngoài hoặc Esc
  document.getElementById('activate-modal')?.addEventListener('click', e => {
    if (e.target.id === 'activate-modal') closeActivateModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeActivateModal();
  });
});

// Theo dõi thay đổi auth
supabaseClient.auth.onAuthStateChange(() => {
  updateUserUI();
});
