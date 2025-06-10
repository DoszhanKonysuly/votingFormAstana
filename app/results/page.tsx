"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Trophy, Loader2 } from "lucide-react"
import { getVoteResults, getCandidates, type Candidate } from "@/lib/voting-data"

export default function ResultsPage() {
  const [results, setResults] = useState<Record<string, number>>({})
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true)
        const [resultsData, candidatesData] = await Promise.all([getVoteResults(), getCandidates()])
        setResults(resultsData)
        setCandidates(candidatesData)
      } catch (error) {
        console.error("Error loading results:", error)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [])

  const getCandidateById = (id: string) => candidates.find((c) => c.id === id)

  const getTopCandidate = () => {
    const entries = Object.entries(results)
    if (entries.length === 0) return null
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))
  }

  const winner = getTopCandidate()

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Election Results</h1>
        <p className="text-gray-600">Live results for the Astana Trustee Leader Election 2024</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Astana Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {winner && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Leading Candidate</span>
                </div>
                <div className="font-bold text-lg text-center">{getCandidateById(winner[0])?.name}</div>
                <div className="text-sm text-gray-600 text-center">{winner[1]} votes</div>
              </div>
            )}

            {Object.entries(results).map(([candidateId, votes]) => {
              const candidate = getCandidateById(candidateId)
              if (!candidate) return null

              return (
                <div key={candidateId} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-gray-600">{candidate.position}</div>
                  </div>
                  <Badge variant="secondary">{votes} votes</Badge>
                </div>
              )
            })}

            {Object.keys(results).length === 0 && (
              <div className="text-center py-4 text-gray-500">No votes recorded yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
