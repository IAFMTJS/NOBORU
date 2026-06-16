type PrototypeLabShellProps = {
  children: React.ReactNode;
};

/** Full-viewport shell for the UI lab — light tokens only, no app bottom nav. */
export function PrototypeLabShell({ children }: PrototypeLabShellProps) {
  return (
    <div className="light min-h-dvh bg-transparent font-sans text-foreground antialiased [--nav-height:3.75rem]">
      <main className="relative z-10 mx-auto flex h-dvh w-full max-w-phone flex-col overflow-hidden bg-transparent">
        {children}
      </main>
    </div>
  );
}
