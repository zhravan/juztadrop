'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Users, MapPin, Heart, Clock, Briefcase, Mail, ChevronRight, Phone, Calendar, Award, Target, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'

interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  state: string
  pincode: string
  interests: string[]
  skills: string | null
  availability: string
  bio: string | null
  experience: string | null
  motivation: string | null
  email_verified: boolean
  createdAt: string
  updatedAt: string
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [phoneCopied, setPhoneCopied] = useState(false)

  useEffect(() => {
    fetchVolunteers()
  }, [])

  useEffect(() => {
    filterVolunteers()
  }, [searchQuery, selectedInterest, volunteers])

  const fetchVolunteers = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${API_URL}/volunteers`)
      const data = await response.json()
      
      // Only show email-verified volunteers on public page
      const verifiedVolunteers = data.filter((v: Volunteer) => v.email_verified)
      setVolunteers(verifiedVolunteers)
      setFilteredVolunteers(verifiedVolunteers)
    } catch (error) {
      console.error('Error fetching volunteers:', error)
      toast.error('Failed to load volunteers. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filterVolunteers = () => {
    let filtered = volunteers

    if (searchQuery) {
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.skills?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedInterest) {
      filtered = filtered.filter(v => v.interests.includes(selectedInterest))
    }

    setFilteredVolunteers(filtered)
  }

  const openVolunteerModal = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer)
    setIsModalOpen(true)
    setEmailCopied(false)
    setPhoneCopied(false)
  }

  const copyToClipboard = async (text: string, type: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'email') {
        setEmailCopied(true)
        setTimeout(() => setEmailCopied(false), 2000)
        toast.success('Email copied to clipboard!')
      } else {
        setPhoneCopied(true)
        setTimeout(() => setPhoneCopied(false), 2000)
        toast.success('Phone number copied to clipboard!')
      }
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy to clipboard')
    }
  }

  const allInterests = Array.from(new Set(volunteers.flatMap(v => v.interests)))
  
  const stats = [
    {
      icon: Users,
      label: 'Active Volunteers',
      value: volunteers.length,
      color: 'text-drop-600',
      bgColor: 'bg-drop-100'
    },
    {
      icon: MapPin,
      label: 'Cities Covered',
      value: new Set(volunteers.map(v => v.city)).size,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Heart,
      label: 'Causes Supported',
      value: allInterests.length,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100'
    },
    {
      icon: Clock,
      label: 'Hours Contributed',
      value: volunteers.length * 25, // Estimated
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ]

  return (
    <main className="flex-1 min-h-screen bg-gradient-to-b from-white via-drop-50/30 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-drop-500 via-drop-600 to-drop-700 text-white">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 md:space-y-6">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-bold mb-2 sm:mb-4">
              🌟 Community Heroes
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight px-2">
              Meet Our Volunteers
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-drop-100 leading-relaxed max-w-2xl mx-auto px-2">
              Discover amazing individuals making a difference across India. Connect with passionate volunteers.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 md:h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats Overview */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-8 -mt-4 sm:-mt-6 md:-mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border border-slate-200 sm:border-2 shadow-md sm:shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full ${stat.bgColor} mb-2 sm:mb-3`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 mb-0.5 sm:mb-1">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-medium leading-tight">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="space-y-4 sm:space-y-6">
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              type="text"
              placeholder="Search volunteers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg border-2 border-slate-300 focus:border-drop-500 rounded-lg sm:rounded-xl"
            />
          </div>

          {/* Interest Filter */}
          {allInterests.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
                Filter by Interest
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge
                  variant={selectedInterest === null ? "default" : "outline"}
                  className={`cursor-pointer px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm font-semibold transition-all ${
                    selectedInterest === null
                      ? 'bg-drop-600 hover:bg-drop-700'
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => setSelectedInterest(null)}
                >
                  All ({volunteers.length})
                </Badge>
                {allInterests.map((interest) => {
                  const count = volunteers.filter(v => v.interests.includes(interest)).length
                  return (
                    <Badge
                      key={interest}
                      variant={selectedInterest === interest ? "default" : "outline"}
                      className={`cursor-pointer px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm font-semibold transition-all ${
                        selectedInterest === interest
                          ? 'bg-drop-600 hover:bg-drop-700'
                          : 'hover:bg-slate-100'
                      }`}
                      onClick={() => setSelectedInterest(interest)}
                    >
                      {interest} ({count})
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Volunteers Grid */}
      <section className="container mx-auto px-3 sm:px-4 lg:px-8 pb-10 sm:pb-16 md:pb-20">
        {loading ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-drop-600 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-slate-600 font-medium">Loading volunteers...</p>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 mb-4 sm:mb-6">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 px-4">No volunteers found</h3>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 px-4">
              {searchQuery || selectedInterest
                ? "Try adjusting your search or filters"
                : "Be the first to join our community!"}
            </p>
            {!searchQuery && !selectedInterest && (
              <Button asChild className="bg-drop-600 hover:bg-drop-700 text-sm sm:text-base">
                <Link href="/volunteer/register">
                  Become a Volunteer
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
                Showing <span className="text-drop-600 font-bold">{filteredVolunteers.length}</span> volunteer{filteredVolunteers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredVolunteers.map((volunteer) => (
                <Card
                  key={volunteer.id}
                  className="border border-slate-200 sm:border-2 hover:border-drop-400 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => openVolunteerModal(volunteer)}
                >
                  <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                    {/* Avatar & Name */}
                    <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                      <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-drop-400 to-drop-600 flex items-center justify-center text-white font-black text-lg sm:text-xl md:text-2xl">
                        {volunteer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-0.5 sm:mb-1 group-hover:text-drop-600 transition-colors line-clamp-1">
                          {volunteer.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{volunteer.city}, {volunteer.state}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {volunteer.bio && (
                      <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 leading-relaxed">
                        {volunteer.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {volunteer.skills && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                          <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                          Skills
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-1">
                          {volunteer.skills}
                        </p>
                      </div>
                    )}

                    {/* Interests */}
                    {volunteer.interests.length > 0 && (
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                          Interests
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {volunteer.interests.slice(0, 3).map((interest, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[10px] sm:text-xs bg-drop-100 text-drop-700 hover:bg-drop-200 px-1.5 py-0.5 sm:px-2 sm:py-1">
                              {interest}
                            </Badge>
                          ))}
                          {volunteer.interests.length > 3 && (
                            <Badge variant="secondary" className="text-[10px] sm:text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 sm:px-2 sm:py-1">
                              +{volunteer.interests.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-200">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
                      <span className="font-medium text-emerald-700 truncate">{volunteer.availability}</span>
                    </div>

                    {/* Contact Button */}
                    <Button
                      variant="outline"
                      className="w-full border border-drop-300 sm:border-2 hover:bg-drop-50 hover:border-drop-500 text-drop-700 font-semibold group-hover:shadow-md transition-all text-xs sm:text-sm h-9 sm:h-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        openVolunteerModal(volunteer)
                      }}
                    >
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span className="hidden xs:inline">View Profile & Contact</span>
                      <span className="xs:hidden">View Profile</span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Volunteer Profile Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] xs:max-h-[90vh] overflow-y-auto p-3 xs:p-4 sm:p-6">
          {selectedVolunteer && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-2 xs:gap-3 sm:gap-4 mb-3 sm:mb-4 pr-6">
                  <div className="flex-shrink-0 w-12 h-12 xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-drop-400 to-drop-600 flex items-center justify-center text-white font-black text-lg xs:text-xl sm:text-3xl">
                    {selectedVolunteer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base xs:text-lg sm:text-2xl font-black text-slate-900 mb-1 sm:mb-2 pr-2">
                      {selectedVolunteer.name}
                    </DialogTitle>
                    <div className="flex flex-wrap items-center gap-1 text-slate-600 text-[11px] xs:text-xs sm:text-sm">
                      <MapPin className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{selectedVolunteer.city}, {selectedVolunteer.state}</span>
                      <span className="text-slate-400 hidden xs:inline">•</span>
                      <span className="text-[11px] xs:text-xs sm:text-sm">{selectedVolunteer.pincode}</span>
                    </div>
                  </div>
                </div>
                <DialogDescription className="text-[11px] xs:text-xs sm:text-sm">
                  Full profile and contact information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 xs:space-y-4 sm:space-y-6 pt-3 xs:pt-4 sm:pt-6">
                {/* Bio */}
                {selectedVolunteer.bio && (
                  <div className="space-y-1.5 xs:space-y-2">
                    <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 xs:gap-2">
                      <Users className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      About
                    </h3>
                    <p className="text-xs xs:text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-2.5 xs:p-3 sm:p-4 rounded-lg">
                      {selectedVolunteer.bio}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-1.5 xs:space-y-2 sm:space-y-3">
                  <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 xs:gap-2">
                    <Mail className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                    Contact Information
                  </h3>
                  <div className="bg-slate-50 p-2 xs:p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
                    {/* Email */}
                    <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-4 p-1.5 xs:p-2 sm:p-3 bg-white rounded-md border border-slate-200">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0 flex-1">
                        <Mail className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-drop-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs text-slate-500 font-medium">Email</p>
                          <p className="text-[11px] xs:text-xs sm:text-sm text-slate-900 font-medium truncate">{selectedVolunteer.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(selectedVolunteer.email, 'email')}
                        className="flex-shrink-0 h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 p-0"
                      >
                        {emailCopied ? (
                          <Check className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-4 p-1.5 xs:p-2 sm:p-3 bg-white rounded-md border border-slate-200">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0 flex-1">
                        <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-drop-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] xs:text-xs text-slate-500 font-medium">Phone</p>
                          <p className="text-[11px] xs:text-xs sm:text-sm text-slate-900 font-medium">{selectedVolunteer.phone}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(selectedVolunteer.phone, 'phone')}
                        className="flex-shrink-0 h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 p-0"
                      >
                        {phoneCopied ? (
                          <Check className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {selectedVolunteer.skills && (
                  <div className="space-y-1.5 xs:space-y-2">
                    <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 xs:gap-2">
                      <Briefcase className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      Skills & Expertise
                    </h3>
                    <p className="text-xs xs:text-sm sm:text-base text-slate-700 bg-slate-50 p-2.5 xs:p-3 sm:p-4 rounded-lg">
                      {selectedVolunteer.skills}
                    </p>
                  </div>
                )}

                {/* Interests */}
                {selectedVolunteer.interests.length > 0 && (
                  <div className="space-y-1.5 xs:space-y-2">
                    <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 xs:gap-2">
                      <Heart className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      Interests & Causes
                    </h3>
                    <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
                      {selectedVolunteer.interests.map((interest, idx) => (
                        <Badge key={idx} className="bg-drop-100 text-drop-700 hover:bg-drop-200 px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-3 sm:py-1 text-[10px] xs:text-xs sm:text-sm">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="space-y-1.5 xs:space-y-2">
                  <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 xs:gap-2">
                    <Clock className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                    Availability
                  </h3>
                  <div className="bg-emerald-50 p-2.5 xs:p-3 sm:p-4 rounded-lg border border-emerald-200">
                    <p className="text-xs xs:text-sm sm:text-base text-emerald-700 font-semibold">{selectedVolunteer.availability}</p>
                  </div>
                </div>

                {/* Experience */}
                {selectedVolunteer.experience && (
                  <div className="space-y-1.5 xs:space-y-2">
                    <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 xs:gap-2">
                      <Award className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      Experience
                    </h3>
                    <p className="text-xs xs:text-sm sm:text-base text-slate-700 bg-slate-50 p-2.5 xs:p-3 sm:p-4 rounded-lg leading-relaxed">
                      {selectedVolunteer.experience}
                    </p>
                  </div>
                )}

                {/* Motivation */}
                {selectedVolunteer.motivation && (
                  <div className="space-y-1.5 xs:space-y-2">
                    <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 xs:gap-2">
                      <Target className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                      Motivation
                    </h3>
                    <p className="text-xs xs:text-sm sm:text-base text-slate-700 bg-slate-50 p-2.5 xs:p-3 sm:p-4 rounded-lg leading-relaxed">
                      {selectedVolunteer.motivation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 xs:pt-4 border-t">
                  <Button
                    asChild
                    className="flex-1 bg-drop-600 hover:bg-drop-700 h-9 xs:h-10 sm:h-11"
                  >
                    <a href={`mailto:${selectedVolunteer.email}`} className="flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2" />
                      <span className="text-xs xs:text-sm sm:text-base">Send Email</span>
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border border-drop-300 xs:border-2 hover:bg-drop-50 h-9 xs:h-10 sm:h-11"
                  >
                    <a href={`tel:${selectedVolunteer.phone}`} className="flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5 xs:mr-2" />
                      <span className="text-xs xs:text-sm sm:text-base">Call Now</span>
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </main>
  )
}
