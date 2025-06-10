"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Award, CheckCircle } from "lucide-react"
import { getTrusteeshipText } from "@/lib/utils"
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
      className={`w-80 h-[600px] transition-all duration-300 cursor-pointer ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl hover:scale-105"
      } ${isSelected ? "ring-4 ring-blue-500 shadow-2xl scale-105" : "shadow-lg"}`}
      onClick={onSelect}
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* Photo Section - Fixed Height */}
        <div className="relative mb-6 flex-shrink-0">
          <img
            src={candidate.photo_url || "/placeholder.svg"}
            alt={candidate.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          {isSelected && (
            <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-2 shadow-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Content Section - Flexible Height */}
        <div className="flex-1 flex flex-col space-y-4">
          {/* Name and Position */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{candidate.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{candidate.position}</p>
          </div>

          {/* Experience and Education */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{getTrusteeshipText(candidate.experience)}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Award className="h-4 w-4 flex-shrink-0" />
              <span className="text-center">{candidate.education}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 text-center leading-relaxed flex-1">{candidate.description}</p>

          {/* Specializations */}
          <div className="flex flex-wrap justify-center gap-2">
            {candidate.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
                {spec}
              </Badge>
            ))}
          </div>

          {/* Select Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            variant={isSelected ? "default" : "outline"}
            className="w-full mt-4 py-3 font-semibold"
            disabled={disabled}
          >
            {disabled ? "Голосование закрыто" : isSelected ? "Выбрано" : "Выбрать кандидата"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
