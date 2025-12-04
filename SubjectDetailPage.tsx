interface SubjectDetailPageProps {
  subjectTitle: string;
  onBack: () => void;
}

export function SubjectDetailPage({ subjectTitle, onBack }: SubjectDetailPageProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={onBack} className="mb-4 text-pink-500 hover:underline">&larr; Quay lại Đại cương</button>
      <h2 className="text-2xl font-bold mb-4">{subjectTitle}</h2>
      <p>Đây là chi tiết tài liệu cho môn {subjectTitle}. Bạn có thể liệt kê link download, hình ảnh, file PDF ở đây.</p>
    </div>
  );
}
