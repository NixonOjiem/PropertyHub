'use client'
import React from 'react'
import NavigationBar from '@/components/NavigationBar'
import MapsView from '@/components/MapsView'
import InformationalComponent from '@/components/InformationalComponent'

const colorStyles = `
  :root {
    --primary-color: #25790b;
    --secondary-color: #122b9c;
    --text-color: #ebf2fa;
    --text-color-dark: #0a192f;
  }
`;

function Page() {
  return (
     <>
      <style>{colorStyles}</style>
      
      {/* KEY LAYOUT CLASSES:
        - `flex flex-col`: Makes the entire page a vertical flex container.
        - `h-screen`: Ensures the container takes up the full viewport height.
        - `overflow-hidden`: Prevents the whole page from scrolling.
      */}
      <div className="flex flex-col h-screen bg-white overflow-hidden">
        
        {/* NavigationBar takes its natural height. */}
        <NavigationBar />
        
        {/* KEY LAYOUT CLASSES:
          - `flex-grow`: Allows this main content area to expand and fill the remaining vertical space.
          - `flex-col md:flex-row`: Stacks panels on mobile, places them side-by-side on desktop.
          - `overflow-hidden`: Prevents weird scrolling issues within the main area.
        */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        
          {/* INFORMATIONAL PANEL:
            - `md:w-1/4`: Takes 25% of width on medium screens and up.
            - `overflow-y-auto`: CRITICAL. This makes ONLY this panel scrollable.
          */}
          <div className="w-full md:w-1/4 p-4 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <InformationalComponent />
          </div>
          
          {/* MAPS VIEW:
            - `md:w-3/4`: Takes 75% of width on medium screens and up.
            - `p-4`: Adds padding around the map itself.
            - `flex-grow`: Ensures it takes up remaining space on mobile view.
          */}
          <div className="w-full md:w-3/4 p-4 flex-grow md:flex-grow-0">
            <MapsView />
          </div>

        </div>
      </div>
    </>
  )
}

export default Page