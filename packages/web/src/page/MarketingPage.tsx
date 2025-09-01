export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur">
        <span className="font-bold text-2xl text-blue-600">ChatApp</span>
        <div className="flex gap-4">
          <a href="/auth/SignInPage" className="text-blue-600 font-medium hover:underline">Sign In</a>
          <a href="/auth/SignUpPage" className="text-blue-600 font-medium hover:underline">Sign Up</a>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-blue-700 drop-shadow-lg">
            Welcome to <span className="text-blue-500">ChatApp</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Effortless messaging. Private groups. Share moments. <br />
            All in a beautiful, secure, and modern chat platform.
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <a href="/auth/SignUpPage" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition text-lg">Get Started Free</a>
            <a href="/auth/SignInPage" className="px-8 py-4 bg-white border border-blue-600 text-blue-600 rounded-lg font-semibold shadow-lg hover:bg-blue-50 transition text-lg">Sign In</a>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <img src="/hero-chat-illustration.svg" alt="ChatApp Hero" className="max-w-xl w-full h-auto rounded-xl shadow-2xl border border-blue-100" />
        </div>
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
      </footer>
    </div>
  );
}
