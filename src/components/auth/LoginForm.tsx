'use client'

import { useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
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
      // Redirect to the login route which will handle Google OAuth
      window.location.href = '/auth/login'
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const FeatureCard = ({ icon, title, desc, hoverColor }: { 
    icon: React.ReactNode; 
    title: string; 
    desc: string; 
    hoverColor: string; 
  }) => (
    <div className={`text-center p-4 rounded-lg transition-all duration-300 hover:bg-white/5 hover:scale-105 border border-transparent hover:border-${hoverColor}-500/30`}>
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-300">{desc}</p>
    </div>
  )

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4">
      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <FaYoutube className="text-red-500 text-4xl mr-3" />
            <div>
              <CardTitle className="text-3xl font-bold text-white">
                YouTube Analytics
              </CardTitle>
              <CardDescription className="text-purple-200">
                Powered by AI Insights
              </CardDescription>
            </div>
          </div>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Unlock powerful insights from YouTube content. Analyze videos, discover trends, and get AI-powered recommendations to grow your channel.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full max-w-md bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <FcGoogle className="text-xl mr-2" />
              )}
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>
            
            <p className="text-xs text-gray-400 mt-3">
              We&apos;ll request access to your YouTube data for analysis
            </p>
          </div>

          <Separator className="bg-white/20" />

          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-6">
              What you&apos;ll get access to:
            </h3>
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