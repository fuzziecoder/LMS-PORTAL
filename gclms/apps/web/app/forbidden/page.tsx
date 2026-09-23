import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 bg-warning-50 text-warning-600 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-foreground-strong mb-2">Access Denied (403)</h1>
      <p className="text-foreground-muted max-w-md mb-6 text-sm">
        You do not have permission or necessary role privileges to view this resource.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-semibold hover:bg-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Go to Login
      </Link>
    </div>
  );
}
