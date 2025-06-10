"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Vote, MapPin, CheckCircle } from "lucide-react"
import CandidateCard from "@/components/candidate-card"
import { getCandidates, submitCityVote, getVotingStatus, checkVoteStatus, type Candidate } from "@/lib/voting-data"

export default function VotingForm() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedAstana, setSelectedAstana] = useState<string>("")
  const [selectedAlmaty, setSelectedAlmaty] = useState<string>("")
  const [isSubmittingAstana, setIsSubmittingAstana] = useState(false)
  const [isSubmittingAlmaty, setIsSubmittingAlmaty] = useState(false)
  const [votingStatus, setVotingStatus] = useState({ astana: false, almaty: false })
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

        // Verify with database if needed
        const [astanaVoted, almatyVoted] = await Promise.all([
          localStatus.astana ? Promise.resolve(true) : checkVoteStatus("Astana"),
          localStatus.almaty ? Promise.resolve(true) : checkVoteStatus("Almaty"),
        ])

        setVotingStatus({
          astana: astanaVoted,
          almaty: almatyVoted,
        })
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error loading data",
          description: "Please refresh the page to try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const astanaCandidates = candidates.filter((c) => c.city === "Astana")
  const almatyCandidates = candidates.filter((c) => c.city === "Almaty")

  const handleAstanaSubmit = async () => {
    if (!selectedAstana) {
      toast({
        title: "No candidate selected",
        description: "Please select a candidate from Astana.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingAstana(true)

    try {
      await submitCityVote("Astana", selectedAstana)
      setVotingStatus((prev) => ({ ...prev, astana: true }))

      toast({
        title: "Astana vote submitted!",
        description: "Your vote for Astana trustee leader has been recorded.",
      })
    } catch (error: any) {
      toast({
        title: "Error submitting vote",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingAstana(false)
    }
  }

  const handleAlmatySubmit = async () => {
    if (!selectedAlmaty) {
      toast({
        title: "No candidate selected",
        description: "Please select a candidate from Almaty.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingAlmaty(true)

    try {
      await submitCityVote("Almaty", selectedAlmaty)
      setVotingStatus((prev) => ({ ...prev, almaty: true }))

      toast({
        title: "Almaty vote submitted!",
        description: "Your vote for Almaty trustee leader has been recorded.",
      })
    } catch (error: any) {
      toast({
        title: "Error submitting vote",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingAlmaty(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Astana Section */}
      <Card className={votingStatus.astana ? "opacity-75" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl">Astana Trustee Leader</CardTitle>
              {votingStatus.astana && <CheckCircle className="h-6 w-6 text-green-600" />}
            </div>
            {votingStatus.astana && <span className="text-green-600 font-semibold">Vote Submitted</span>}
          </div>
          <p className="text-gray-600">
            {votingStatus.astana
              ? "You have already voted for Astana trustee leader"
              : "Select one candidate to represent Astana"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {astanaCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isSelected={selectedAstana === candidate.id}
                onSelect={() => !votingStatus.astana && setSelectedAstana(candidate.id)}
                disabled={votingStatus.astana}
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handleAstanaSubmit}
              disabled={isSubmittingAstana || !selectedAstana || votingStatus.astana}
              size="lg"
              className="px-8 py-3"
            >
              {isSubmittingAstana ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : votingStatus.astana ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Vote Submitted
                </>
              ) : (
                <>
                  <Vote className="mr-2 h-5 w-5" />
                  Submit Astana Vote
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Almaty Section */}
      <Card className={votingStatus.almaty ? "opacity-75" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-600" />
              <CardTitle className="text-2xl">Almaty Trustee Leader</CardTitle>
              {votingStatus.almaty && <CheckCircle className="h-6 w-6 text-green-600" />}
            </div>
            {votingStatus.almaty && <span className="text-green-600 font-semibold">Vote Submitted</span>}
          </div>
          <p className="text-gray-600">
            {votingStatus.almaty
              ? "You have already voted for Almaty trustee leader"
              : "Select one candidate to represent Almaty"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {almatyCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isSelected={selectedAlmaty === candidate.id}
                onSelect={() => !votingStatus.almaty && setSelectedAlmaty(candidate.id)}
                disabled={votingStatus.almaty}
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={handleAlmatySubmit}
              disabled={isSubmittingAlmaty || !selectedAlmaty || votingStatus.almaty}
              size="lg"
              className="px-8 py-3"
            >
              {isSubmittingAlmaty ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : votingStatus.almaty ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Vote Submitted
                </>
              ) : (
                <>
                  <Vote className="mr-2 h-5 w-5" />
                  Submit Almaty Vote
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Status */}
      {(votingStatus.astana || votingStatus.almaty) && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center py-6">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Thank you for participating!</h3>
            <p className="text-gray-600">
              {votingStatus.astana && votingStatus.almaty
                ? "You have voted for both cities. Results will be announced after the voting period ends."
                : votingStatus.astana
                  ? "You have voted for Astana. You can still vote for Almaty if you wish."
                  : "You have voted for Almaty. You can still vote for Astana if you wish."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
