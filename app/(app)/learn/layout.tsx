export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2">
      {children}
    </div>
  );
}
