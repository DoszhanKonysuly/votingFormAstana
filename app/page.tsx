import VotingForm from "@/components/voting-form"

export default function VotingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Выборы лидера попечителей Астаны 2024</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Проголосуйте за лидера попечителей в Астане. Выберите одного кандидата для представления ваших интересов.
          </p>
        </div>
        <VotingForm />
      </div>
    </div>
  )
}
