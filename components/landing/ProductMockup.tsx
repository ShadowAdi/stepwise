import { C } from '@/app/page'
import { MousePointerClick } from 'lucide-react'
import React from 'react'

const ProductMockup = () => {
  return (
      <div className="hero-mockup relative">
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: C.lightGrey, background: C.offWhite }}
              >
                <div className="p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#28CA41" }} />
                    <div className="flex-1 mx-4 h-7 rounded-lg" style={{ background: C.lightGrey }} />
                  </div>
                  <div
                    className="aspect-[16/9] md:aspect-[2.2/1] rounded-xl relative overflow-hidden"
                    style={{ background: `linear-gradient(145deg, ${C.offWhite}, ${C.accent}15)` }}
                  >
                    <div className="absolute inset-4 md:inset-8 grid grid-cols-5 gap-4">
                      {/* Sidebar */}
                      <div className="col-span-1 space-y-3">
                        <div className="h-6 rounded-md" style={{ background: C.black + "08" }} />
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="h-3 rounded" style={{ background: C.black + "06", width: `${70 + j * 5}%` }} />
                        ))}
                      </div>
                      {/* Main area */}
                      <div className="col-span-4 rounded-xl p-4 md:p-6 relative" style={{ background: C.white }}>
                        <div className="h-4 w-1/4 rounded mb-4" style={{ background: C.black + "10" }} />
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="h-20 md:h-24 rounded-lg" style={{ background: C.accent + "20" }} />
                          <div className="h-20 md:h-24 rounded-lg" style={{ background: C.warm + "20" }} />
                          <div className="h-20 md:h-24 rounded-lg" style={{ background: C.accent + "15" }} />
                        </div>
                        {/* Hotspot */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-12 h-12 rounded-full animate-ping absolute" style={{ background: C.accentDark + "25" }} />
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center relative"
                            style={{ background: C.accentDark + "15", border: `2px solid ${C.accentDark}` }}
                          >
                            <MousePointerClick className="w-5 h-5" style={{ color: C.accentDark }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default ProductMockup