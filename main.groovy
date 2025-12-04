import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { SubjectDetailPage } from './menu_toancaocap';

const daiCuongSubjects = [
  {
    id: 1,
    title: 'Tài liệu Các môn Toán cao cấp',
    description: 'Dưới đây là tổng hợp các file tài liệu môn Đại số tuyến tính mà mình sưu tầm được. Các bạn nhấn vào nút để tải file về nhé.',
  },
  {
    id: 2,
    title: 'Tài liệu Các môn Vật lý đại cương',
    description: 'Dưới đây là tổng hợp các file tài liệu môn Giải tích 1 mà mình sưu tầm được. Các bạn nhấn vào nút để tải file về nhé.',
  },

  {
    id: 4,
    title: 'Tài liệu các môn Hóa học đại cương',
    description: 'Dưới đây là tổng hợp các file tài liệu môn Hóa học đại cương mà mình sưu tầm được. Các bạn nhấn vào nút để tải file về nhé.',
  },
  {
    id: 5,
    title: 'Tài liệu môn Tin học đại cương',
    description: 'Dưới đây là tổng hợp các file tài liệu môn Tin học đại cương mà mình sưu tầm được. Các bạn nhấn vào nút để tải file về nhé.',
  },
  {
    id: 6,
    title: 'Tài liệu các môn Triết',
    description: 'Dưới đây là tổng hợp các file tài liệu môn Triết học Mác - Lênin mà mình sưu tầm được. Các bạn nhấn vào nút để tải file về nhé.',
  },
  {
    id: 7,
    title: 'Tài liệu Các môn bổ trợ',
    description: 'Dưới đây là tổng hợp các file tài liệu môn Kinh tế chính trị mà mình sưu tầm được. Các bạn nhấn vào nút để tải file về nhé.',
  },
  {
    id: 9,
    title: 'Tài liệu môn Giáo dục thể chất',
    description: 'Dưới đây là tổng hợp các file tài liệu môn Giáo dục thể chất mà mình sưu tầm được. Các bạn nhấn vào nút để tải file về nhé.',
  },
  {
    id: 10,
    title: 'Tài liệu môn Giáo dục quốc phòng',
    description: 'Dưới đây là tổng hợp các file tài liệu môn Giáo dục quốc phòng mà mình sưu tầm được. Các bạn nhấn vào nút để tải file về nhé.',
  },
];

interface DaiCuongPageProps {
  onBackToHome: () => void;
  initialSubject?: string;
}

export function DaiCuongPage({ onBackToHome, initialSubject }: DaiCuongPageProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(initialSubject || null);

  // Update selected subject when initialSubject changes
  useEffect(() => {
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject]);

  // If a subject is selected, show the detail page
  if (selectedSubject) {
    return (
      <SubjectDetailPage
        subjectTitle={selectedSubject}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-pink-200 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="text-center text-gray-800 font-bold text-[36px]">
            TÀI LIỆU CÁC MÔN ĐẠI CƯƠNG
          </h1>
        </div>
      </div>

      {/* Subject Cards */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {daiCuongSubjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center">
                {/* Decorative Illustration */}
                <div className="w-full md:w-64 h-48 bg-pink-50 flex items-center justify-center border-4 border-pink-300 rounded-lg m-4">
                  <div className="text-center p-6">
                    <div className="inline-block bg-pink-200 rounded-full px-6 py-3">
                      <span className="text-gray-700">
                        {subject.title.replace('Tài liệu môn ', '')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8">
                  <h2 className="mb-3 text-blue-600">
                    {subject.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {subject.description}
                  </p>
                  <button 
                    onClick={() => setSelectedSubject(subject.title)}
                    className="inline-flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Discover more
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}