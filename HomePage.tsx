interface HomePageProps {
  onNavigate: (page: 'home' | 'daicuong') => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main className="p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to TÀI LIỆU TX1</h2>
      <p className="mb-6">Chia sẻ tài liệu Đại cương, Chuyên ngành, Tiếng Anh, Phần mềm...</p>
      <button 
        onClick={() => onNavigate('daicuong')}
        className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
      >
        Đi tới Đại cương
      </button>
    </main>
  );
}
