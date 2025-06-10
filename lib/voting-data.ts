import { createBrowserClient, createServerClient } from "./supabase"

export interface Candidate {
  id: string
  name: string
  city: "Astana" | "Almaty"
  position: string
  experience: number
  education: string
  description: string
  photo_url: string
  specializations: string[]
  created_at?: Date
  updated_at?: Date
}

export interface Vote {
  id: string
  city: "Astana" | "Almaty"
  candidate_id: string
  voter_session: string
  ip_address?: string
  created_at?: Date
}

export interface VotingStatus {
  astana: boolean
  almaty: boolean
}

// Get all candidates
export async function getCandidates(): Promise<Candidate[]> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("candidates").select("*").order("name")

  if (error) {
    console.error("Error fetching candidates:", error)
    throw new Error("Failed to fetch candidates")
  }

  return data || []
}

// Get candidates by city
export async function getCandidatesByCity(city: "Astana" | "Almaty"): Promise<Candidate[]> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("candidates").select("*").eq("city", city).order("name")

  if (error) {
    console.error(`Error fetching ${city} candidates:`, error)
    throw new Error(`Failed to fetch ${city} candidates`)
  }

  return data || []
}

// Submit a vote
export async function submitCityVote(city: "Astana" | "Almaty", candidateId: string): Promise<void> {
  const supabase = createBrowserClient()

  // Get or create voter session
  let voterSession = localStorage.getItem("voterSession")
  if (!voterSession) {
    voterSession = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("voterSession", voterSession)
  }

  // Submit vote
  const { error } = await supabase.from("votes").insert([
    {
      city,
      candidate_id: candidateId,
      voter_session: voterSession,
    },
  ])

  if (error) {
    // Check if it's a duplicate vote error
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error(`You have already voted for ${city}`)
    }
    console.error("Error submitting vote:", error)
    throw new Error("Failed to submit vote")
  }

  // Update local voting status
  const status = getVotingStatus()
  status[city.toLowerCase() as keyof VotingStatus] = true
  localStorage.setItem("votingStatus", JSON.stringify(status))
}

// Get voting results
export async function getVoteResults(): Promise<{ astana: Record<string, number>; almaty: Record<string, number> }> {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.from("votes").select("city, candidate_id")

  if (error) {
    console.error("Error fetching vote results:", error)
    throw new Error("Failed to fetch vote results")
  }

  const astanaResults: Record<string, number> = {}
  const almatyResults: Record<string, number> = {}

  data?.forEach((vote) => {
    if (vote.city === "Astana") {
      astanaResults[vote.candidate_id] = (astanaResults[vote.candidate_id] || 0) + 1
    } else {
      almatyResults[vote.candidate_id] = (almatyResults[vote.candidate_id] || 0) + 1
    }
  })

  return { astana: astanaResults, almaty: almatyResults }
}

// Get voting status from local storage
export function getVotingStatus(): VotingStatus {
  if (typeof window === "undefined") {
    return { astana: false, almaty: false }
  }

  try {
    const stored = localStorage.getItem("votingStatus")
    return stored ? JSON.parse(stored) : { astana: false, almaty: false }
  } catch {
    return { astana: false, almaty: false }
  }
}

// Check if user has already voted for a city
export async function checkVoteStatus(city: "Astana" | "Almaty"): Promise<boolean> {
  // First check local storage
  const localStatus = getVotingStatus()
  if (localStatus[city.toLowerCase() as keyof VotingStatus]) {
    return true
  }

  // If not in local storage, check database
  const supabase = createBrowserClient()

  // Get voter session
  const voterSession = localStorage.getItem("voterSession")
  if (!voterSession) {
    return false
  }

  const { data, error } = await supabase
    .from("votes")
    .select("id")
    .eq("city", city)
    .eq("voter_session", voterSession)
    .limit(1)

  if (error) {
    console.error("Error checking vote status:", error)
    return false
  }

  const hasVoted = data && data.length > 0

  // Update local storage if vote found in database
  if (hasVoted) {
    const status = getVotingStatus()
    status[city.toLowerCase() as keyof VotingStatus] = true
    localStorage.setItem("votingStatus", JSON.stringify(status))
  }

  return hasVoted
}

// Admin functions

// Add a new candidate
export async function addCandidate(candidate: Omit<Candidate, "id" | "created_at" | "updated_at">): Promise<Candidate> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("candidates").insert([candidate]).select()

  if (error) {
    console.error("Error adding candidate:", error)
    throw new Error("Failed to add candidate")
  }

  return data[0]
}

// Update an existing candidate
export async function updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("candidates")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating candidate:", error)
    throw new Error("Failed to update candidate")
  }

  return data[0] || null
}

// Delete a candidate
export async function deleteCandidate(id: string): Promise<boolean> {
  const supabase = createServerClient()

  const { error } = await supabase.from("candidates").delete().eq("id", id)

  if (error) {
    console.error("Error deleting candidate:", error)
    throw new Error("Failed to delete candidate")
  }

  return true
}

// Get vote count for a specific candidate
export async function getCandidateVoteCount(candidateId: string): Promise<number> {
  const supabase = createBrowserClient()

  const { count, error } = await supabase
    .from("votes")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", candidateId)

  if (error) {
    console.error("Error getting vote count:", error)
    throw new Error("Failed to get vote count")
  }

  return count || 0
}
