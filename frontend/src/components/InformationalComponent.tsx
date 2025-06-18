import React from 'react'

function InformationalComponent() {
  return (
    <div className="text-[var(--text-color-dark)]">
    <h2 className="text-xl font-bold mb-4 sticky top-0 bg-gray-50 py-2">Details & Filters</h2>
    <p className="text-sm mb-4">This panel contains property information and search filters. It is designed to be scrollable if the content exceeds the viewport height.</p>
    <div className="space-y-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="font-semibold">Property Listing #{i + 1}</p>
          <p className="text-xs text-gray-600">Some details about this item...</p>
        </div>
      ))}
    </div>
  </div>
  )
}

export default InformationalComponent