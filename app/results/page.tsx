"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Trophy, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getVoteResults, getCandidates, type Candidate } from "@/lib/voting-data"
import Link from "next/link"

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
  const totalVotes = Object.values(results).reduce((sum, votes) => sum + votes, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Результаты выборов</h1>
          <p className="text-xl text-gray-600 mb-8">Текущие результаты выборов лидера попечителей Астаны 2024</p>
          <div className="flex justify-center">
            <Link href="/">
              <Button variant="outline" className="px-6 py-3">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Назад к голосованию
              </Button>
            </Link>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl shadow-xl border-0">
            <CardHeader className="text-center py-8">
              <CardTitle className="flex items-center gap-3 justify-center text-3xl">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Результаты Астаны
              </CardTitle>
              <p className="text-lg text-gray-600 mt-4">Всего голосов: {totalVotes}</p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {/* Winner Section */}
              {winner && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl mb-8 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4 justify-center">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <span className="text-2xl font-bold text-blue-800">Лидирующий кандидат</span>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-3xl text-blue-900 mb-2">{getCandidateById(winner[0])?.name}</div>
                    <div className="text-lg text-blue-700 mb-2">{getCandidateById(winner[0])?.position}</div>
                    <div className="text-xl font-semibold text-blue-800">
                      {winner[1]} голосов ({totalVotes > 0 ? Math.round((winner[1] / totalVotes) * 100) : 0}%)
                    </div>
                  </div>
                </div>
              )}

              {/* All Results */}
              <div className="space-y-4">
                {Object.entries(results)
                  .sort(([, a], [, b]) => b - a)
                  .map(([candidateId, votes], index) => {
                    const candidate = getCandidateById(candidateId)
                    if (!candidate) return null

                    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0

                    return (
                      <div key={candidateId} className="bg-white p-6 border rounded-xl shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 text-blue-800 text-lg font-bold px-3 py-1 rounded-full min-w-[40px] text-center">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="font-bold text-lg text-gray-900">{candidate.name}</div>
                              <div className="text-sm text-gray-600">{candidate.position}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="text-lg px-4 py-2 mb-1">
                              {votes} голосов
                            </Badge>
                            <div className="text-sm text-gray-600">{percentage}%</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}

                {Object.keys(results).length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">Голосов пока нет</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
