'use client'

import { useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { signInWithGoogle } from '@/lib/auth'
import { toast } from 'sonner'
import { FaYoutube, FaChartBar, FaSearch, FaRobot } from 'react-icons/fa'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
export function LoginForm() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 px-4 sm:px-6 lg:px-8 py-16 text-white">
      <Card className="w-full max-w-2xl shadow-2xl border border-white/20 rounded-3xl p-6 bg-white/10 backdrop-blur-md">
        <CardHeader className="space-y-4 text-center pb-0">
          <div className="flex items-center justify-center mb-2">
            <FaYoutube className="text-red-500 text-3xl mr-2" />
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-purple-200 text-sm font-medium">
              Introducing YouTube Analytics
            </div>
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">Unlock the Power</span> <br className="hidden sm:block" />
            <span className="text-white">of YouTube Data</span>
          </CardTitle>
          <CardDescription className="text-gray-200 text-md">
            Analyze content, track engagement, and discover actionable insights to grow your YouTube presence.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 mt-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="default"
            className="w-full flex items-center justify-center space-x-2 text-lg font-medium shadow-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white"
          >
            {loading ? (
              <LoadingSpinner className="mr-2" />
            ) : (
              <FcGoogle className="text-xl" />
            )}
            <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
          </Button>

          <Separator className="my-4 bg-white/10" />

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:bg-white/15 hover:border-green-400/30">
              <CardContent className="p-3">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FaChartBar className="text-green-400 text-sm" />
                  </div>
                </div>
                <p className="text-xl font-bold text-green-400">+127%</p>
                <p className="text-xs font-semibold text-gray-300">Engagement Growth</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:bg-white/15 hover:border-blue-400/30">
              <CardContent className="p-3">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FaYoutube className="text-blue-400 text-sm" />
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-400">2.4M</p>
                <p className="text-xs font-semibold text-gray-300">Views</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:bg-white/15 hover:border-purple-400/30">
              <CardContent className="p-3">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg className="text-purple-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl font-bold text-purple-400">85K</p>
                <p className="text-xs font-semibold text-gray-300">Subscribers</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <FeatureCard 
              icon={<FaChartBar className="text-purple-400 text-xl" />} 
              title="Content Analysis" 
              desc="Deep dive into video metrics & engagement." 
              hoverColor="purple"
            />
            <FeatureCard 
              icon={<FaSearch className="text-blue-400 text-xl" />} 
              title="Competitor Insights" 
              desc="Monitor strategies from top channels." 
              hoverColor="blue"
            />
            <FeatureCard 
              icon={<FaRobot className="text-green-400 text-xl" />} 
              title="Growth Tips" 
              desc="AI-based suggestions for faster growth." 
              hoverColor="green"
            />
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2025 YouTube Analytics by YourCompany. All rights reserved.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

function FeatureCard({ icon, title, desc, hoverColor }: { icon: React.ReactNode; title: string; desc: string; hoverColor: 'purple' | 'blue' | 'green' }) {
  const getBorderHoverClass = () => {
    switch (hoverColor) {
      case 'purple': return 'hover:border-purple-400/30';
      case 'blue': return 'hover:border-blue-400/30';
      case 'green': return 'hover:border-green-400/30';
      default: return 'hover:border-white/30';
    }
  };

  return (
    <Card className={`bg-white/10 backdrop-blur-sm border border-white/10 hover:shadow-xl hover:bg-white/15 ${getBorderHoverClass()} transition-all duration-300 group`}>
      <CardContent className="p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-all duration-300">
          {icon}
        </div>
        <CardTitle className="text-sm font-semibold text-white">{title}</CardTitle>
        <CardDescription className="text-xs text-gray-300">{desc}</CardDescription>
      </CardContent>
    </Card>
  );
}