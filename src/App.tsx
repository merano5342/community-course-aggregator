import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CourseListPage } from '@/pages/CourseListPage';
import { ComparePage } from '@/pages/ComparePage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { SchedulePage } from '@/pages/SchedulePage';
import { AboutPage } from '@/pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<CourseListPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
