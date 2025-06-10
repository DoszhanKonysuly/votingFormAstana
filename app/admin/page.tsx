"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, BarChart3, UserPlus } from "lucide-react"
import { getCandidates, getVoteResults, type Candidate } from "@/lib/voting-data"
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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard - Astana</h1>
        <div className="flex gap-4">
          <Link href="/admin/add-candidate">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Candidate
            </Button>
          </Link>
          <Link href="/results">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Results
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {candidates.map((candidate) => (
          <CandidateAdminCard key={candidate.id} candidate={candidate} voteCount={getCandidateVotes(candidate.id)} />
        ))}
      </div>
    </div>
  )
}

interface CandidateAdminCardProps {
  candidate: Candidate
  voteCount: number
}

function CandidateAdminCard({ candidate, voteCount }: CandidateAdminCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{candidate.name}</CardTitle>
          <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">{voteCount} votes</div>
        </div>
        <p className="text-sm text-gray-500">{candidate.position}</p>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <img
            src={candidate.photo_url || "/placeholder.svg"}
            alt={candidate.name}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div className="ml-4">
            <p className="text-sm">
              <strong>Experience:</strong> {candidate.experience} years
            </p>
            <p className="text-sm">
              <strong>Education:</strong> {candidate.education}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Link href={`/admin/edit-candidate/${candidate.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Link href={`/admin/delete-candidate/${candidate.id}`}>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
