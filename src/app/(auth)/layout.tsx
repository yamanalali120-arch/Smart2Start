/**
 * Auth layout: centered content, no navigation.
 * Used for login, reset-password, set-password pages.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-green-50 via-white to-brand-plum-50 px-4">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green-500 text-white shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="12" r="5" />
            <circle cx="16" cy="12" r="5" />
            <path d="M3 12h1M20 12h1M13 12h-2" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          brillen.de <span className="text-brand-green-500">Academy</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Dein Weg zum Optik-Experten
        </p>
      </div>

      {/* Content Card */}
      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} brillen.de – Internes Lernportal
      </p>
    </div>
  );
}