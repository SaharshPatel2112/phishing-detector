import { Show, SignInButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">AI Phishing Detection Platform</h1>

      <Show when="signed-out">
        <SignInButton>
          <button className="rounded bg-black px-4 py-2 text-white">
            Sign In
          </button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <p>You're signed in.</p>
        <UserButton />
      </Show>
    </main>
  )
}