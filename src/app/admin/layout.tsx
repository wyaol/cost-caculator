
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    // ⚠️ 实际生产环境中：这里会进行身份验证检查
    // if (!currentUserIsAdmin) { 
    //    redirect('/login'); 
    // }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gray-800 text-white p-4">
                <h1 className="text-xl">Admin Panel</h1>
            </header>
            <div className="p-8">
                {children}
            </div>
        </div>
    );
}