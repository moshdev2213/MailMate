"use client"

import type React from "react"
import { useState } from "react"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onPage: () => void
}

export default function SearchBar({ searchQuery, onSearchChange, onPage }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(inputValue)
    onPage()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search emails by subject, sender, or content..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder-slate-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}


