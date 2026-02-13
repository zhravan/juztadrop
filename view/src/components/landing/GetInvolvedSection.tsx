'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const LOCATIONS = ['Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'];

const OPPORTUNITIES = [
  {
    id: 1,
    title: 'Lets feed the stray-dogs',
    organisation: 'Calcutta, Dog Community',
    location: 'New Town, Kolkata, New Town, Kolkata - East, West Bengal',
    dateRange: '29th, Dec -> 31st, Dec',
    timeRange: '8.30pm -> 9.30pm',
    category: 'animal-care',
    icon: '🐕',
  },
  {
    id: 2,
    title: 'Beach cleanup drive',
    organisation: 'Ocean Guardians',
    location: 'Marine Drive, Mumbai, Maharashtra',
    dateRange: '15th, Feb -> 16th, Feb',
    timeRange: '6.00am -> 10.00am',
    category: 'environment',
    icon: '🌊',
  },
  {
    id: 3,
    title: 'Teach basic literacy',
    organisation: 'Siksha Foundation',
    location: 'Salt Lake, Kolkata, West Bengal',
    dateRange: 'Every Saturday',
    timeRange: '10.00am -> 12.00pm',
    category: 'education',
    icon: '📚',
  },
  {
    id: 4,
    title: 'Community kitchen volunteer',
    organisation: 'Annapurna Trust',
    location: 'Park Street, Kolkata, West Bengal',
    dateRange: 'Daily',
    timeRange: '11.00am -> 2.00pm',
    category: 'community',
    icon: '🍲',
  },
];

export function GetInvolvedSection() {
  const [location, setLocation] = useState('Kolkata');
  const [locationOpen, setLocationOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    }
    if (locationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [locationOpen]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-jad-teal md:text-3xl">
            Get Involved Near You,
          </h2>
          <div ref={locationRef} className="relative">
            <button
              type="button"
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground"
            >
              {location}
              <ChevronDown className="h-4 w-4" />
            </button>
            {locationOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-lg border bg-popover py-1 shadow-lg">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setLocation(loc);
                      setLocationOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-2 scroll-smooth scrollbar-hide md:snap-x md:snap-mandatory [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
          >
            {OPPORTUNITIES.map((opp) => (
              <div
                key={opp.id}
                className="min-w-[280px] flex-1 shrink-0 rounded-xl border bg-card p-5 shadow-sm md:min-w-[calc(33.333%-1rem)] md:snap-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-jad-teal/10 text-2xl">
                  {opp.icon}
                </div>
                <h3 className="font-semibold text-foreground">{opp.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  {opp.organisation}
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {opp.location}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {opp.dateRange}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {opp.timeRange}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted"
            aria-label="Previous opportunities"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1.5">
            {OPPORTUNITIES.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === 0 ? 'bg-jad-teal' : 'bg-muted-foreground/30'
                }`}
                aria-hidden
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted"
            aria-label="Next opportunities"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
