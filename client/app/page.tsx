import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value

  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">MailMate</span>
          </h1>
          <p className="text-xl text-slate-600">
            Your personal Gmail inbox manager with intelligent filtering and organization
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 py-8">
          <div className="flex items-center gap-3 text-left bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-slate-700 font-medium">Secure OAuth2 Authentication</span>
          </div>
          <div className="flex items-center gap-3 text-left bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
              </svg>
            </div>
            <span className="text-slate-700 font-medium">Beautiful Email Interface</span>
          </div>
          <div className="flex items-center gap-3 text-left bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16a4 4 0 100-8 4 4 0 000 8zM2 9a7 7 0 1112.955 3.746A7.002 7.002 0 012 9z" />
              </svg>
            </div>
            <span className="text-slate-700 font-medium">Search & Filter Emails</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/login" className="w-full">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
            Sign In with Gmail
          </button>
        </Link>

        {/* Footer */}
        <p className="text-sm text-slate-500 pt-4">Secure. Fast. Simple. Powered by IMAP & OAuth2.</p>
      </div>
    </div>
  )
}
