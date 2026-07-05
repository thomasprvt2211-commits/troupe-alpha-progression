export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-scout-cream/40 via-white to-white">
      {children}
    </div>
  );
}
