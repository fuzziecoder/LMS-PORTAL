import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 bg-surface-muted text-foreground-muted rounded-full flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-foreground-strong mb-2">Page Not Found</h1>
      <p className="text-foreground-muted max-w-md mb-6 text-sm">
        The requested resource could not be found or you may not have access to view it.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-semibold hover:bg-primary-700 transition-colors"
      >
        <Home className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
