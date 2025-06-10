import VotingForm from "@/components/voting-form"

export default function VotingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Astana Trustee Leader Election 2024</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vote for the trustee leader in Astana. Select one candidate to represent your interests.
          </p>
        </div>
        <VotingForm />
      </div>
    </div>
  )
}
