import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SubjectDetailPage } from './SubjectDetailPage';

const daiCuongSubjects = [
  { id: 1, title: 'Toán cao cấp', description: 'Tài liệu môn Toán cao cấp...' },
  { id: 2, title: 'Vật lý đại cương', description: 'Tài liệu môn Vật lý...' },
  { id: 3, title: 'Hóa học đại cương', description: 'Tài liệu môn Hóa học...' },
];

interface DaiCuongPageProps {
  onBackToHome: () => void;
}

export function DaiCuongPage({ onBackToHome }: DaiCuongPageProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  if (selectedSubject) {
    return <SubjectDetailPage subjectTitle={selectedSubject} onBack={() => setSelectedSubject(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <button onClick={onBackToHome} className="mb-4 text-pink-500 hover:underline">&larr; Quay lại Trang chủ</button>
      <h2 className="text-2xl font-bold mb-6 text-center">Tài liệu các môn Đại cương</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {daiCuongSubjects.map(subject => (
          <div key={subject.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{subject.title}</h3>
            <p className="text-gray-600 mb-4">{subject.description}</p>
            <button
              onClick={() => setSelectedSubject(subject.title)}
              className="inline-flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded transition-colors"
            >
              Discover more <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
