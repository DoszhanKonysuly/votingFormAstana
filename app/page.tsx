import VotingForm from "@/components/voting-form"

export default function VotingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/images/iqclub-logo.png" alt="IQClub Logo" className="h-16 md:h-20 w-auto" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Голосование за Председателя IQClub Астана 2025-2026
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            2025-2026 IQClub Астана Төрағасына дауыс беру
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ваш голос — вклад в развитие комьюнити IQClub.
          </p>
        </div>
        <VotingForm />
      </div>
    </div>
  )
}
