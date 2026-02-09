"use client"

import { useParams } from 'next/navigation';

const page = () => {
  const params = useParams();
  const demoId = params.id as string;

  return (
    <div className="min-h-screen bg-surface p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-x-6 flex flex-row h-[90vh]">
        <section className="border-2 border-border rounded-lg p-6 bg-background hover:border-border-light transition-colors flex-[0.2] h-full">
          <h2 className="text-2xl font-semibold text-text-primary mb-3">
            Section 1
          </h2>
          <p className="text-text-secondary">
            This is the first section. Demo ID
          </p>
        </section>

        <section className="border-2 border-border rounded-lg p-6 bg-background hover:border-border-light transition-colors flex-[0.6]">
          <h2 className="text-2xl font-semibold text-text-primary mb-3">
            Section 2
          </h2>
          <p className="text-text-secondary">
            This is the second section with content.
          </p>
        </section>

       <section className="border-2 border-border rounded-lg p-6 bg-background hover:border-border-light transition-colors flex-[0.2]">
          <h2 className="text-2xl font-semibold text-text-primary mb-3">
            Section 3
          </h2>
          <p className="text-text-secondary">
            This is the third section area.
          </p>
        </section>
      </div>
    </div>
  )
}

export default page