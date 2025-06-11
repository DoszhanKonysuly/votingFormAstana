"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, BarChart3, UserPlus, ArrowLeft } from "lucide-react"
import { getCandidates, getVoteResults, type Candidate } from "@/lib/voting-data"
import { getTrusteeshipText } from "@/lib/utils"
import Link from "next/link"

export default function AdminPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [results, setResults] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [candidatesData, resultsData] = await Promise.all([getCandidates(), getVoteResults()])
        setCandidates(candidatesData)
        setResults(resultsData)
      } catch (error) {
        console.error("Error loading admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getCandidateVotes = (id: string): number => {
    return results[id] || 0
  }

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
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/images/iqclub-logo.png" alt="IQClub Logo" className="h-16 md:h-20 w-auto" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Панель администратора</h1>
          <p className="text-xl text-gray-600 mb-8">Управление выборами Председателя IQClub Астана</p>

          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline" className="px-6 py-3">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Вернуться к голосованию
              </Button>
            </Link>
            <Link href="/admin/add-candidate">
              <Button className="px-6 py-3">
                <UserPlus className="mr-2 h-5 w-5" />
                Добавить кандидата
              </Button>
            </Link>
            <Link href="/results">
              <Button variant="outline" className="px-6 py-3">
                <BarChart3 className="mr-2 h-5 w-5" />
                Посмотреть результаты
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="text-center shadow-lg">
            <CardContent className="py-8">
              <div className="text-3xl font-bold text-blue-600 mb-2">{candidates.length}</div>
              <div className="text-gray-600">Всего кандидатов</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardContent className="py-8">
              <div className="text-3xl font-bold text-green-600 mb-2">{totalVotes}</div>
              <div className="text-gray-600">Всего голосов</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardContent className="py-8">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {totalVotes > 0 ? Math.round(totalVotes / candidates.length) : 0}
              </div>
              <div className="text-gray-600">Среднее голосов/кандидат</div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Grid */}
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-8 max-w-6xl">
            {candidates.map((candidate) => (
              <CandidateAdminCard
                key={candidate.id}
                candidate={candidate}
                voteCount={getCandidateVotes(candidate.id)}
                totalVotes={totalVotes}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CandidateAdminCardProps {
  candidate: Candidate
  voteCount: number
  totalVotes: number
}

function CandidateAdminCard({ candidate, voteCount, totalVotes }: CandidateAdminCardProps) {
  const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0

  return (
    <Card className="w-80 h-[500px] shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-bold">{candidate.name}</CardTitle>
          <div className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">{voteCount} голосов</div>
        </div>
        <p className="text-sm text-gray-500">{candidate.position}</p>
        <div className="text-xs text-gray-400">{percentage}% от общего числа голосов</div>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        <div className="flex mb-4">
          <img
            src={candidate.photo_url || "/placeholder.svg"}
            alt={candidate.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="ml-4 flex-1">
            <p className="text-sm mb-2">
              <strong>Стаж:</strong> {getTrusteeshipText(candidate.experience)}
            </p>
            <p className="text-sm">
              <strong>Образование:</strong> {candidate.education}
            </p>
          </div>
        </div>

        {/* Vote Progress */}
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-auto">
          <Link href={`/admin/edit-candidate/${candidate.id}`}>
            <Button variant="outline" size="sm" className="px-4">
              Редактировать
            </Button>
          </Link>
          <Link href={`/admin/delete-candidate/${candidate.id}`}>
            <Button variant="destructive" size="sm" className="px-4">
              Удалить
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
