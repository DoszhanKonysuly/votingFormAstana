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

  const handleSubmit = async () => {
    if (!selectedCandidate) {
      toast({
        title: "No candidate selected",
        description: "Please select a candidate before submitting your vote.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitVote(selectedCandidate)
      setHasVoted(true)

      toast({
        title: "Vote submitted successfully!",
        description: "Your vote for Astana trustee leader has been recorded.",
      })
    } catch (error: any) {
      toast({
        title: "Error submitting vote",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
      <Card className={hasVoted ? "opacity-75" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl">Astana Trustee Leader Candidates</CardTitle>
              {hasVoted && <CheckCircle className="h-6 w-6 text-green-600" />}
            </div>
            {hasVoted && <span className="text-green-600 font-semibold">Vote Submitted</span>}
          </div>
          <p className="text-gray-600">
            {hasVoted ? "You have already voted for Astana trustee leader" : "Select one candidate to represent Astana"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
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

          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedCandidate || hasVoted}
              size="lg"
              className="px-8 py-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : hasVoted ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Vote Submitted
                </>
              ) : (
                <>
                  <Vote className="mr-2 h-5 w-5" />
                  Submit Vote
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Message */}
      {hasVoted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center py-6">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Thank you for participating!</h3>
            <p className="text-gray-600">
              Your vote has been recorded. Results will be announced after the voting period ends.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
