 // Mobile menu toggle
    document.querySelector('.mobile-menu').addEventListener('click', () => {
      document.querySelector('.nav').classList.toggle('nav-active');
    });

    // Feedback form submission
    document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('status');
      const formData = new FormData(e.target);

      try {
        const res = await fetch(e.target.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          status.textContent = 'Gửi góp ý thành công! Cảm ơn bạn ❤️';
          e.target.reset();
        } else {
          status.textContent = 'Gửi thất bại. Thử lại nhé!';
        }
      } catch {
        status.textContent = 'Có lỗi xảy ra.';
      }
    });

    // Search suggestions
    const searchInput = document.getElementById('searchInput');
    const suggestionsDiv = document.getElementById('suggestions');

    // Bảng từ khóa → trang
const searchMap = [
  // triết học
  { keywords: ["EM1170 Pháp luật đại cương"], page: "pages/triet.html" },
  { keywords: ["SSH1111 Triết học Mác-Lênin"], page: "pages/triet.html" },
  { keywords: ["SSH1121 Kinh tế chính trị"], page: "pages/triet.html" },
  { keywords: ["SSH1131 Chủ nghĩa xã hội khoa học"], page: "pages/triet.html" },
  { keywords: ["SSH1141 Lịch sử Đảng"], page: "pages/triet.html" },
  { keywords: ["SSH1151 Tư tưởng Hồ Chí Minh"], page: "pages/triet.html" },
// toán, lý, tin 
  { keywords: ["MI1142 Đại số tuyến tính"], page: "pages/toancaocap.html" },
  { keywords: ["MI1112 Giải tích 1"], page: "pages/toancaocap.html" },
  { keywords: ["MI1122 Giải tích 2"], page: "pages/toancaocap.html" },
  { keywords: ["MI1132 Giải tích 3"], page: "pages/toancaocap.html" },
  { keywords: ["MI2021 Xác suất thống kê"], page: "pages/toancaocap.html" },
  { keywords: ["MI2010 Phương pháp tính"], page: "pages/toancaocap.html" },

  { keywords: ["PH1111 Vật lý đại cương 1"], page: "pages/vatly.html" },
  { keywords: ["PH1121 Vật lý đại cương 2"], page: "pages/vatly.html" },
  { keywords: ["PH1131 Vật lý đại cương 3"], page: "pages/vatly.html" },

  { keywords: ["IT1140 Tin học đại cương"], page: "pages/tinhoc.html" },

  { keywords: ["CH1017 Hóa học"], page: "pages/hoahoc.html" },
  { keywords: ["CH3223 Hóa hữu cơ"], page: "pages/hoahoc.html" },
// cơ so và cốt lõi ngành chung 

// cơ sở ngành học chung
  { keywords: ["EE2012 Kỹ thuật điện"], page: "pages/cosonganhchung.html" },
  { keywords: ["ME2015 Đồ họa kỹ thuật cơ bản"], page: "pages/cosonganhchung.html" },
  { keywords: ["HE2012 Kỹ thuật nhiệt"], page: "pages/cosonganhchung.html" },
  { keywords: ["ME3211 Nguyên lý máy"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3090 Cơ sở mỹ thuật sản phẩm dệt may"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3180 Cấu trúc vải sợi"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3140 Tiếng anh chuyên ngành dệt may"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3131 Quản lý chất lượng dệt may"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3010 Quản lý sản xuất dệt may"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3141 Cơ sở xử lý hóa học sản phẩm dệt may"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3161 Thực hành sợi, vải"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3030 Marketing dệt may"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3060 Thực hành kiểm tra và phân tích vật liệu dệt may"], page: "pages/cosonganhchung.html" },
  { keywords: ["TEX3150 Vật liệu dệt may"], page: "pages/cosonganhchung.html" },

// cơ sở ngành khối may

  { keywords: ["TEX4352 Thực hành may cơ bản"], page: "pages/cosonganhkhoimay.html" },
  { keywords: ["TEX4372 Thực hành may nâng cao"], page: "pages/cosonganhkhoimay.html" },
  { keywords: ["TEX4502 Công nghệ gia công sản phẩm may"], page: "pages/cosonganhkhoimay.html" },
  { keywords: ["TEX4382 Thiết kế trang phục"], page: "pages/cosonganhkhoimay.html" },
  { keywords: ["TEX4462 Thực hành thiết kế trang phục"], page: "pages/cosonganhkhoimay.html" },


  { keywords: ["TEX4851 Công nghệ kéo xơ sợi ngắn"], page: "pages/cosonganhkhoidet.html" },
  { keywords: ["TEX4591 Công nghệ dệt kim cơ bản"], page: "pages/cosonganhkhoidet.html" },
  { keywords: ["TEX4503 Khoa học màu sắc"], page: "pages/cosonganhkhoidet.html" },
  { keywords: ["TEX4601 CÔng nghệ dệt thoi I"], page: "pages/cosonganhkhoidet.html" },
  { keywords: ["TEX3070 An toàn lao động và môi trường dệt may"], page: "pages/cosonganhkhoidet.html" },
  { keywords: ["TEX4432 Hệ thống công nghệ và quá trình may"], page: "pages/cosonganhkhoidet.html" },

// công nghệ sản xuất sản phẩm dệt

  { keywords: ["TEX4471 Công nghệ không dệt"], page: "pages/congnhesanxuatsanphamdet.html" },
  { keywords: ["TEX4611 Công nghệ dệt thoi II"], page: "pages/congnhesanxuatsanphamdet.html" },
  { keywords: ["TEX4451 Kỹ thuật dệt kim hoa"], page: "pages/congnhesanxuatsanphamdet.html" },
  { keywords: ["TEX4621 Công nghệ kéo sợi xơ dài"], page: "pages/congnhesanxuatsanphamdet.html" },
  { keywords: ["TEX4631 Thiết kế dây chuyền sợi dệt"], page: "pages/congnhesanxuatsanphamdet.html" },
  { keywords: ["TEX4551 Thực hành dệt 1"], page: "pages/congnhesanxuatsanphamdet.html" },
  { keywords: ["TEX641 Cấu trúc sợi"], page: "pages/congnhesanxuatsanphamdet.html" },
  { keywords: ["TEX3081 Cấu trúc vải dệt thoi"], page: "pages/congnhesanxuatsanphamdet.html" },
  { keywords: ["TEX3091 Cấu trúc vải dệt kim"], page: "pages/congnhesanxuatsanphamdet.html" },

  // công nghệ may
  { keywords: ["TEX4332 Thiết bị may công nghiệp"], page: "pages/congnhemay.html" },
  { keywords: ["TEX4442 Công nghệ sản xuất sản phẩm may"], page: "pages/congnhemay.html" },
  { keywords: ["TEX4422 Thiết kế dây chuyền may"], page: "pages/congnhemay.html" },
  { keywords: ["TEX4002 Thiết kế công nghệ quá trình sản phẩm may"], page: "pages/congnhemay.html" },
  { keywords: ["TEX4282 Thiết kế mẫu sản xuất"], page: "pages/congnhemay.html" },
  { keywords: ["TEX4272 Thiết kế sản phẩm may theo đơn hàng"], page: "pages/congnhemay.html" },
  { keywords: ["TEX4512 Ứng dụng công nghệ thông tin trong công nghiệp may"], page: "pages/congnhemay.html" },
// hóa dệt
  { keywords: ["CH3071 Hóa lý"], page: "pages/vatlieuvacongnghehoantat.html" },
  { keywords: ["TEX4023 Hóa học thực phẩm"], page: "pages/vatlieuvacongnghehoantat.html" },
  { keywords: ["TEX4463 Công nghệ và thiết bị sản phẩm dệt"], page: "pages/vatlieuvacongnghehoantat.html" },
  { keywords: ["TEX4523 Phân tích thành phần hoá học vải liệu dệt may"], page: "pages/vatlieuvacongnghehoantat.html" },
  { keywords: ["TEX4473 Công nghệ và thiết bị nhuộm – in hoàn tất sản phẩm dệt may"], page: "pages/vatlieuvacongnghehoantat.html" },
  { keywords: ["TEX4513 Thực hành công nghệ nhuộm – in hoàn tất sản phẩm dệt may"], page: "pages/vatlieuvacongnghehoantat.html" },
  { keywords: ["TEX5253 Kiểm soát chất lượng sản phẩm nhuộm và hoàn tất"], page: "pages/vatlieuvacongnghehoantat.html" },

  { keywords: ["TEX4455 Hình họa thời trang"], page: "pages/thietkethoitrangvadagiay.html" },
  { keywords: ["TEX4465 Thiết kế mỹ thuật trang phục"], page: "pages/thietkethoitrangvadagiay.html" },
  { keywords: ["TEX4475 Tin học ứng dụng trong thiết kế mỹ thuật trang phục"], page: "pages/thietkethoitrangvadagiay.html" },
  { keywords: ["TEX4125 Tại màu trên trang phục may sẵn"], page: "pages/thietkethoitrangvadagiay.html" },
  { keywords: ["TEX4445 Phần mềm ứng dụng trong thiết kế thời trang"], page: "pages/thietkethoitrangvadagiay.html" },
  { keywords: ["TEX4485 Thiết kế bộ sưu tập thời trang"], page: "pages/thietkethoitrangvadagiay.html" },
  { keywords: ["TEX4525 Thiết kế sản phẩm thời trang giá y"], page: "pages/thietkethoitrangvadagiay.html" },
  { keywords: ["TEX4515 Thiết kế và công nghệ sản phẩm áo dài"], page: "pages/thietkethoitrangvadagiay.html" },

  { keywords: ["TEX4382 Thiết kế trang phục"], page: "pages/thietkevaidetmay.html" },
  { keywords: ["TEX4016 Thiết kế sản phẩm sơ mi"], page: "pages/thietkevaidetmay.html" },
  { keywords: ["TEX4026 Thiết kế vải dệt thoi đơn giản"], page: "pages/thietkevaidetmay.html" },
  { keywords: ["TEX4116 Thiết kế sản phẩm vest dệt kim"], page: "pages/thietkevaidetmay.html" },
  { keywords: ["TEX4106 Thực hành phần tử và thiết kế vải I"], page: "pages/thietkevaidetmay.html" },
  { keywords: ["TEX4066 Nguyên lý tạo mẫu sản phẩm dệt may"], page: "pages/thietkevaidetmay.html" },
  { keywords: ["TEX4076 Phần mềm ứng dụng trong thiết kế vải"], page: "pages/thietkevaidetmay.html" },
  { keywords: ["TEX4086 Thực hành tạo mẫu sản phẩm dệt may"], page: "pages/thietkevaidetmay.html" },
  { keywords: ["TEX4096 Tín học ứng dụng trong thiết kế vải"], page: "pages/thietkevaidetmay.html" },

// vstep 
  { keywords: ["VSTEP - Luyện thi B1, B2 cùng Huy"], page: "pages/vstep.html" },

//phần mềm

{ keywords: ["Clo 3D"], page: "pages/pmnganhdetmay" },
  
  
];

 function getSuggestions(query) {
      query = query.toLowerCase().trim();
      if (!query) return [];
      const results = [];
      const seen = new Set();

      for (const item of searchMap) {
        for (const kw of item.keywords) {
          if (kw.toLowerCase().includes(query) && !seen.has(kw)) {
            seen.add(kw);
            results.push({ keyword: kw, page: item.page });
          }
        }
      }
      return results;
    }

    function highlightText(text, query) {
      const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<span class="highlight">$1</span>');
    }

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      const results = getSuggestions(query);

      suggestionsDiv.innerHTML = '';
      if (results.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
      }

      results.forEach(r => {
        const div = document.createElement('div');
        div.innerHTML = highlightText(r.keyword, query);
        div.addEventListener('click', () => location.href = `${r.page}?highlight=${encodeURIComponent(r.keyword)}`);
        suggestionsDiv.appendChild(div);
      });
      suggestionsDiv.style.display = 'block';
    });

    // Enter để chuyển đến kết quả đầu tiên
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const results = getSuggestions(searchInput.value);
        if (results.length > 0) {
          location.href = `${results[0].page}?highlight=${encodeURIComponent(results[0].keyword)}`;
        } else {
          alert('Không tìm thấy tài liệu phù hợp!');
        }
      }
    });

    // Click ngoài để ẩn gợi ý
 document.addEventListener('click', e => {
  if (!document.querySelector('.search-bar').contains(e.target)) {
    suggestionsDiv.style.display = 'none';
  }
});


    // Highlight card khi truy cập từ tìm kiếm (dùng cho các trang danh sách môn như daicuong.html, chuyennganh.html...)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const highlight = params.get('highlight');
  if (!highlight) return;

  document.querySelectorAll('.subject-card').forEach(card => {
    const title = card.querySelector('.subject-title');
    if (title && title.textContent.toLowerCase().includes(highlight.toLowerCase())) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('card-highlight');
      setTimeout(() => card.classList.remove('card-highlight'), 4000);
    }
  });
});
    