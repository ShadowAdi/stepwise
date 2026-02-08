export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {children}
        </div>
    );
}
