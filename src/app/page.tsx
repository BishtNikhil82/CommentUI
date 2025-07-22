export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            YouTube Analytics
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to analyze YouTube content and discover insights
          </p>
        </div>
        <div>
          <SetupWarningButton />
        </div>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Setup Required:</strong> Please configure your Supabase environment variables in <code>.env.local</code> to enable authentication.
          </p>
        </div>
      </div>
    </div>
  )
}