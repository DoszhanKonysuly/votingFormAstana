"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Vote, MapPin, CheckCircle } from "lucide-react"
import CandidateCard from "@/components/candidate-card"
import { getCandidates, submitVote, getVotingStatus, checkVoteStatus, type Candidate } from "@/lib/voting-data"

export default function VotingForm() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Get candidates from Supabase
        const candidatesData = await getCandidates()
        setCandidates(candidatesData)

        // Check voting status
        const localStatus = getVotingStatus()
        const voted = localStatus || (await checkVoteStatus())
        setHasVoted(voted)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Ошибка загрузки данных",
          description: "Пожалуйста, обновите страницу и попробуйте снова.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSubmit = async () => {
    if (!selectedCandidate) {
      toast({
        title: "Кандидат не выбран",
        description: "Пожалуйста, выберите кандидата перед отправкой голоса.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitVote(selectedCandidate)
      setHasVoted(true)

      toast({
        title: "Голос успешно отправлен!",
        description: "Ваш голос за лидера попечителей Астаны записан.",
      })
    } catch (error: any) {
      toast({
        title: "Ошибка отправки голоса",
        description: error.message || "Пожалуйста, попробуйте позже.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Main Voting Section */}
      <Card className={`${hasVoted ? "opacity-75" : ""} shadow-lg border-0`}>
        <CardHeader className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-3xl font-bold">Кандидаты в лидеры попечителей Астаны</CardTitle>
            {hasVoted && <CheckCircle className="h-8 w-8 text-green-600" />}
          </div>
          {hasVoted && (
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
              <CheckCircle className="h-5 w-5" />
              Голос отправлен
            </div>
          )}
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            {hasVoted
              ? "Вы уже проголосовали за лидера попечителей Астаны"
              : "Выберите одного кандидата для представления Астаны"}
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {/* Candidates Grid - Perfectly Centered */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="inline-flex flex-wrap justify-center gap-8 max-w-6xl">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isSelected={selectedCandidate === candidate.id}
                    onSelect={() => !hasVoted && setSelectedCandidate(candidate.id)}
                    disabled={hasVoted}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button - Centered */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedCandidate || hasVoted}
              size="lg"
              className="px-12 py-4 text-lg font-semibold min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Отправка...
                </>
              ) : hasVoted ? (
                <>
                  <CheckCircle className="mr-3 h-6 w-6" />
                  Голос отправлен
                </>
              ) : (
                <>
                  <Vote className="mr-3 h-6 w-6" />
                  Отправить голос
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Message - Symmetric */}
      {hasVoted && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-600" />
            <h3 className="text-2xl font-bold mb-4 text-green-800">Спасибо за участие!</h3>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Ваш голос записан. Результаты будут объявлены после окончания периода голосования.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
