import { useState } from 'react';
import { Header } from './Header';
import { HomePage } from './HomePage';
import { DaiCuongPage } from './DaiCuongPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'daicuong'>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentPage} />

      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
      {currentPage === 'daicuong' && <DaiCuongPage onBackToHome={() => setCurrentPage('home')} />}
    </div>
  );
}
