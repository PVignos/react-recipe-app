import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
}

function PageLayout({
  title,
  children,
  backTo,
  backLabel = "Back",
}: PageLayoutProps) {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-lg px-4 py-10 min-h-screen">
      {backTo && (
        <button
          onClick={() => navigate(backTo)}
          className="flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-700 transition-colors mb-6"
        >
          <span aria-hidden="true">←</span> {backLabel}
        </button>
      )}
      <h1 className="text-2xl font-semibold text-neutral-800 mb-8">{title}</h1>
      {children}
    </main>
  );
}

export default PageLayout;
