
"use client";
import { SetupWarningButton } from '@/components/auth/SetupWarningButton'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 px-4 py-12">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-8 md:gap-12 py-12 md:py-20">
        {/* Left Content */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-200 text-sm font-medium mb-2">
            Introducing YouTube Analytics
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Unlock</span> the Power of YouTube Data
          </h1>
          <p className="text-lg md:text-xl text-purple-100/80 max-w-xl">
            Analyze content, track engagement, and discover actionable insights to grow your YouTube presence.
          </p>
          <div className="pt-4">
            <SetupWarningButton />
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-purple-200 text-sm">
              <span className="font-semibold">1,000+</span> creators already using our platform
            </p>
          </div>
        </div>

        {/* Right Content - Floating Card */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl transform hover:scale-105 transition duration-500">
            <div className="p-1">
              <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-purple-300">analytics.dashboard</div>
                </div>
                <div className="space-y-4">
                  <div className="h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                    <div className="text-purple-200 text-center">
                      <div className="text-3xl font-bold">+127%</div>
                      <div className="text-xs">Engagement Growth</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30 flex items-center justify-center">
                      <div className="text-blue-200 text-center">
                        <div className="text-xl font-bold">2.4M</div>
                        <div className="text-xs">Views</div>
                      </div>
                    </div>
                    <div className="h-20 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-lg border border-pink-500/30 flex items-center justify-center">
                      <div className="text-pink-200 text-center">
                        <div className="text-xl font-bold">85K</div>
                        <div className="text-xs">Subscribers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto w-full py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Content Analysis",
              description: "Deep dive into video performance metrics and audience engagement patterns.",
              icon: "📊"
            },
            {
              title: "Competitor Insights",
              description: "Track and analyze competitor strategies to stay ahead in your niche.",
              icon: "🔍"
            },
            {
              title: "Growth Recommendations",
              description: "Get AI-powered suggestions to improve your content strategy and audience growth.",
              icon: "📈"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition duration-300">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-purple-200/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 pb-4">
        <p className="text-sm text-purple-200/60">
          © {new Date().getFullYear()} YouTube Analytics by <span className="font-semibold text-purple-200">YourCompany</span>. All rights reserved.
        </p>
      </div>
    </div>
  );
}
