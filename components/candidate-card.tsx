"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Award, CheckCircle } from "lucide-react"
import type { Candidate } from "@/lib/voting-data"

interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  onSelect: () => void
  disabled?: boolean
}

export default function CandidateCard({ candidate, isSelected, onSelect, disabled = false }: CandidateCardProps) {
  return (
    <Card
      className={`max-w-sm w-full transition-all duration-200 ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
      } ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
    >
      <CardContent className="p-6">
        <div className="relative mb-4">
          <img
            src={candidate.photo_url || "/placeholder.svg"}
            alt={candidate.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          {isSelected && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
              <CheckCircle className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.position}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{candidate.experience} years experience</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="h-4 w-4" />
            <span>{candidate.education}</span>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3">{candidate.description}</p>

          <div className="flex flex-wrap gap-2">
            {candidate.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>

          <Button
            onClick={onSelect}
            variant={isSelected ? "default" : "outline"}
            className="w-full mt-4"
            disabled={disabled}
          >
            {disabled ? "Voting Closed" : isSelected ? "Selected" : "Select Candidate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
