import { Logo } from "../components/ui/Logo";

export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-400 opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Logo showText={true} size="lg" />
        </div>
        <div className="flex items-center gap-6">
          <a href="/auth/SignInPage" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Sign In</a>
          <a href="/auth/SignUpPage" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-all hover:shadow-md">Sign Up</a>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 md:px-8 py-12 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-6 py-2 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-8">
            Launching September 2025
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500 bg-clip-text text-transparent leading-tight">
            The Modern Way to Connect
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Effortless messaging. Private groups. Share moments. 
            <br className="hidden md:block" />
            All in a beautiful, secure, and intuitive platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href="/auth/SignUpPage" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-lg"
            >
              Get Started Free
            </a>
            <a 
              href="/auth/SignInPage" 
              className="px-8 py-4 bg-white border border-blue-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:border-blue-400 hover:bg-blue-50 transition text-lg"
            >
              Sign In
            </a>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Real-time Messaging</h3>
              <p className="text-gray-600">Instant communication with friends and groups with live typing indicators.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">End-to-End Encryption</h3>
              <p className="text-gray-600">Your conversations are private and secure with advanced encryption.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Media Sharing</h3>
              <p className="text-gray-600">Easily share photos, videos, and files with your contacts.</p>
            </div>
          </div>
        </div>
        
        {/* App screenshot/illustration */}
        <div className="w-full flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <img 
              src="/hero-chat-illustration.svg" 
              alt="cnnct Interface" 
              className="max-w-4xl w-full h-auto rounded-xl shadow-2xl border border-blue-100" 
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-blue-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} cnnct. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Terms</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
