import { requireUnauth } from "@/features/auth/actions/index";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {

    await requireUnauth();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100">
            <div className="w-full max-w-md rounded-lg bg-blue-100 p-8 shadow-md">
                {children}
            </div>
        </div>
    )
}