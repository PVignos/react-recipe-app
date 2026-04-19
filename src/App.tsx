import ErrorBoundary from "./components/ui/ErrorBoundary";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import Spinner from "./components/ui/Spinner";

// Lazy load pages — each becomes its own JS chunk.
const WizardPage = lazy(() => import("./pages/WizardPage"));
const RecipePage = lazy(() => import("./pages/RecipePage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <NavBar />
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<WizardPage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
