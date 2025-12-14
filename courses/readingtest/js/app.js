const { createClient } = supabase;
const supabaseClient = createClient('https://wdpekgcqmwpvbfyonjih.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkcGVrZ2NxbXdwdmJmeW9uamloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODk4NjUsImV4cCI6MjA4MDk2NTg2NX0.qaIDzIZsGSifXO8PKM2jDAx7E6Earv2K7iFPQ8GqqaU');

let currentTestId = null;
let passages = [];
let currentPassageIndex = 0;
let passageResults = [];
let totalTimeLeft = 3600;   // 60 phút tổng
let passageTimeLeft = 900;  // 15 phút mỗi passage
let totalTimerInterval = null;
let passageTimerInterval = null;

// Hàm quy đổi band CEFR dựa trên số câu đúng (tổng 40 câu)
function getCEFRBand(correctCount) {
  if (correctCount >= 33) return { band: "C", score: "8.5 - 9.0" };
  if (correctCount >= 25) return { band: "B2", score: "6.5 - 8.0" };
  if (correctCount >= 16) return { band: "B1", score: "4.0 - 6.0" };
  return { band: "A", score: "< 4.0" };
}

async function loadTests() {
  const { data: tests, error } = await supabaseClient.from('tests').select('id, title');
  const list = document.getElementById('test-list');
  if (error || !tests || tests.length === 0) {
    list.innerHTML = '<p class="text-center text-red-600 py-20 text-2xl">Không có đề thi nào.</p>';
    console.error('Supabase error:', error);
    return;
  }
  list.innerHTML = '';
  tests.forEach(test => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-3xl shadow-2xl p-8 text-center cursor-pointer hover:scale-105 transition';
    card.innerHTML = `
      <h3 class="text-2xl font-black text-primary mb-4">${test.title}</h3>
      <p class="text-gray-600 mb-6">4 passages • 40 câu • 60 phút</p>
      <button type="button" class="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold">Làm bài</button>
    `;
    card.onclick = () => startTest(test.id, test.title);
    list.appendChild(card);
  });
}

async function startTest(testId, title) {
  currentTestId = testId;
  document.getElementById('test-title').textContent = title;
  document.getElementById('test-list').classList.add('hidden');
  document.getElementById('test-page').classList.remove('hidden');
  document.getElementById('prev-passage-btn').onclick = () => changePassage(-1);
  document.getElementById('next-passage-btn').onclick = () => changePassage(1);

  const { data } = await supabaseClient.from('passages').select('*, questions(*)').eq('test_id', testId).order('passage_number');
  passages = data || [];
  currentPassageIndex = 0;
  passageResults = new Array(passages.length).fill(null);

  renderAllPassages();
  updateNavigation();
  startTotalTimer();
  startPassageTimer();
}

function startTotalTimer() {
  clearInterval(totalTimerInterval);
  totalTimerInterval = setInterval(() => {
    totalTimeLeft--;
    if (totalTimeLeft <= 0) {
      clearInterval(totalTimerInterval);
      clearInterval(passageTimerInterval);
      submitTest();
    }
    document.getElementById('total-timer').textContent = formatTime(totalTimeLeft);
    document.getElementById('progress').style.width = `${((3600 - totalTimeLeft) / 3600) * 100}%`;
  }, 1000);
}

function startPassageTimer() {
  clearInterval(passageTimerInterval);
  passageTimeLeft = 900;
  document.getElementById('passage-timer').textContent = '15:00';
  passageTimerInterval = setInterval(() => {
    passageTimeLeft--;
    document.getElementById('passage-timer').textContent = formatTime(passageTimeLeft);
    if (passageTimeLeft <= 0) {
      clearInterval(passageTimerInterval);
      finishPassage(currentPassageIndex);
      alert('Hết thời gian cho passage này! Đã tự động chữa bài và chuyển sang passage tiếp theo.');
      if (currentPassageIndex < passages.length - 1) {
        changePassage(1);
      }
    }
  }, 1000);
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}function renderAllPassages() {
  const form = document.getElementById('reading-form');
  form.innerHTML = '';

  passages.forEach((p, pIndex) => {
    const section = document.createElement('section');
    section.className = 'passage-section bg-white rounded-3xl shadow-xl p-8';
    section.dataset.index = pIndex;
    if (pIndex !== currentPassageIndex) section.classList.add('hidden');

    let feedbackHTML = '';
    if (passageResults[pIndex]) {
      const { correctCount, totalQuestions } = passageResults[pIndex];
      const score = (correctCount / totalQuestions * 10).toFixed(1);
      feedbackHTML = `
        <div class="passage-feedback mt-8 bg-green-50 p-6 rounded-2xl border border-green-300">
          <p class="text-2xl font-bold mb-4 text-green-800">
            Bạn đúng ${correctCount}/${totalQuestions} câu (Điểm: ${score}/10)
          </p>
          ${p.video_url ? `
          <div class="mb-4">
            <iframe width="100%" height="315" src="${p.video_url}" title="Video giải thích Passage ${p.passage_number}" frameborder="0" allowfullscreen class="rounded-lg"></iframe>
          </div>` : ''}
        </div>
      `;
    }

    // FIX CUỐI CÙNG: Loại bỏ hoàn toàn dấu \n thô, tách đoạn đẹp
    const cleanText = p.passage_text
      .replace(/\\n/g, '\n')  // Chuyển \\n thành \n thật (nếu có escape)
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n+/g, '\n\n');  // Chuẩn hóa xuống dòng

    const paragraphs = cleanText.split('\n\n')
      .map(par => par.trim())
      .filter(par => par.length > 0);

    const formattedText = paragraphs
      .map(par => `<p class="mt-6 first:mt-0 text-lg leading-relaxed">${par.replace(/\n/g, '<br>')}</p>`)
      .join('');

    section.innerHTML = `
      <h2 class="text-3xl font-bold text-primary mb-6">Passage ${p.passage_number} / ${passages.length}</h2>
      <div class="passage-text bg-pink-50 p-8 rounded-2xl mb-8 text-lg leading-relaxed">
        ${formattedText || '<p class="text-gray-500">Không có nội dung passage.</p>'}
      </div>
      <div class="grid gap-8 md:grid-cols-2">
        ${p.questions.map((q, qIndex) => `
          <div>
            <p class="font-bold text-lg mb-4">Câu ${pIndex * 10 + qIndex + 1}: ${q.question_text}</p>
            <div class="space-y-3">
              ${['a','b','c','d'].map(opt => {
                const isCorrect = opt === q.correct_option;
                const disabled = passageResults[pIndex] ? 'disabled' : '';
                const userSelected = q.userSelected || null;
                let classes = 'border-gray-300';

                if (passageResults[pIndex]) {
                  if (isCorrect) classes = 'bg-green-100 border-green-500 font-bold';
                  else if (userSelected === opt && !isCorrect) classes = 'bg-red-100 border-red-500';
                }

                return `
                  <label class="block p-4 rounded-xl border ${classes} hover:border-primary cursor-pointer transition">
                    <input type="radio" name="q${q.id}" value="${opt}" class="mr-3" ${disabled} ${userSelected === opt ? 'checked' : ''}>
                    <span>${q['option_' + opt]}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      ${feedbackHTML}
      <div class="text-center mt-10">
        <button type="button" 
                class="px-10 py-4 bg-primary text-white rounded-xl font-bold ${passageResults[pIndex] ? 'opacity-60 cursor-not-allowed' : ''}" 
                onclick="finishPassage(${pIndex})" 
                ${passageResults[pIndex] ? 'disabled' : ''}>
          Hoàn thành & Chữa Passage này
        </button>
      </div>
    `;
    form.appendChild(section);
  });
}
function finishPassage(pIndex) {
  if (passageResults[pIndex]) return;
  clearInterval(passageTimerInterval);

  const passage = passages[pIndex];
  let correctCount = 0;

  passage.questions.forEach(q => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    q.userSelected = selected ? selected.value : null;
    if (q.userSelected === q.correct_option) correctCount++;
  });

  passageResults[pIndex] = {
    correctCount,
    totalQuestions: passage.questions.length
  };

  renderAllPassages();
  updateNavigation();
}
function changePassage(delta) {
  const newIndex = currentPassageIndex + delta;

  if (newIndex < 0 || newIndex >= passages.length) return; // Không cho vượt giới hạn

  // Ẩn passage hiện tại, hiện passage mới
  document.querySelectorAll('.passage-section').forEach((section, i) => {
    section.classList.toggle('hidden', i !== newIndex);
  });

  currentPassageIndex = newIndex;

  // Quan trọng: Cập nhật navigation + timer
  updateNavigation();

  // Nếu passage mới chưa làm thì khởi động lại timer 15 phút
  if (!passageResults[currentPassageIndex]) {
    startPassageTimer();
  }
}

function updateNavigation() {
  // Cập nhật nút Prev/Next
  document.getElementById('prev-passage-btn').disabled = currentPassageIndex === 0;
  document.getElementById('next-passage-btn').disabled = currentPassageIndex === passages.length - 1;

  // Cập nhật text ở giữa: Passage X / Y
  document.getElementById('passage-nav-text').textContent = `Passage ${currentPassageIndex + 1} / ${passages.length}`;

  // Tùy chọn: Thay đổi màu nút Next khi là passage cuối
  const nextBtn = document.getElementById('next-passage-btn');
  if (currentPassageIndex === passages.length - 1) {
    nextBtn.classList.remove('bg-primary', 'text-white');
    nextBtn.classList.add('bg-gray-300', 'text-gray-600', 'cursor-not-allowed');
  } else {
    nextBtn.classList.remove('bg-gray-300', 'text-gray-600', 'cursor-not-allowed');
    nextBtn.classList.add('bg-primary', 'text-white');
  }

  // Tương tự cho nút Prev
  const prevBtn = document.getElementById('prev-passage-btn');
  if (currentPassageIndex === 0) {
    prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}
function submitTest() {
  clearInterval(totalTimerInterval);
  clearInterval(passageTimerInterval);

  // Tự động hoàn thành các passage chưa làm
  passages.forEach((p, i) => {
    if (!passageResults[i]) {
      let correct = 0;
      p.questions.forEach(q => {
        const sel = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (sel && sel.value === q.correct_option) correct++;
      });
      passageResults[i] = { correctCount: correct, totalQuestions: p.questions.length };
    }
  });

  const totalCorrect = passageResults.reduce((sum, r) => sum + r.correctCount, 0);
  const cefr = getCEFRBand(totalCorrect);

  // Ẩn hoàn toàn nút nộp bài
  document.getElementById('submit-test-btn').style.display = 'none';

  // Hiển thị kết quả
  document.getElementById('score-display').innerHTML = `
    Bạn đúng <span class="text-green-600 text-5xl font-black">${totalCorrect}</span> / 40 câu
  `;
  document.getElementById('cefr-band').textContent = cefr.band;
  document.getElementById('cefr-score').textContent = cefr.score;

  // Điểm từng passage
  const scoresDiv = document.getElementById('passage-scores');
  scoresDiv.innerHTML = '';
  passageResults.forEach((r, i) => {
    const score = (r.correctCount / r.totalQuestions * 10).toFixed(1);
    const div = document.createElement('div');
    div.className = 'bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-6 text-center shadow-lg';
    div.innerHTML = `<p class="text-lg font-semibold">Passage ${i+1}</p><p class="text-4xl font-black mt-2">${score}/10</p>`;
    scoresDiv.appendChild(div);
  });

  document.getElementById('result').classList.remove('hidden');
}

// Navigation buttons
document.getElementById('prev-passage-btn').onclick = () => changePassage(-1);
document.getElementById('next-passage-btn').onclick = () => changePassage(1);
document.getElementById('submit-test-btn').onclick = submitTest;

window.addEventListener('load', loadTests);

// Kiểm tra đăng nhập
supabaseClient.auth.getSession().then(({ data }) => {
  if (!data.session) {
    window.location.href = "/login.html";
  }
});