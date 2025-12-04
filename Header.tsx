interface HeaderProps {
  onNavigate: (page: 'home' | 'daicuong') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="bg-pink-500 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => onNavigate('home')}>
          TAILIEUTX1
        </h1>

        <nav className="space-x-4">
          <button onClick={() => onNavigate('home')} className="hover:text-pink-200">Trang chủ</button>
          <button onClick={() => onNavigate('daicuong')} className="hover:text-pink-200">Đại cương</button>
        </nav>
      </div>
    </header>
  );
}
