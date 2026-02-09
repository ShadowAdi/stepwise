"use client"

import { useParams } from 'next/navigation';
import Image from 'next/image';

const page = () => {
  const params = useParams();
  const demoId = params.id as string;

  // Sample steps data
  const steps = [
    { id: 1, title: 'Getting Started', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop' },
    { id: 2, title: 'Setup Configuration', image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=300&fit=crop' },
    { id: 3, title: 'Build Interface', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop' },
    { id: 4, title: 'Add Features', image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop' },
    { id: 5, title: 'Testing Phase', image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop' },
    { id: 6, title: 'Deploy & Launch', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop' },
  ];

  return (
    <div className="h-screen bg-surface p-4 md:p-6 lg:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-row gap-6">
        <section className="border-2 border-border rounded-lg bg-background hover:border-border-light transition-colors flex-[0.2] h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-text-primary">
              Steps
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="group cursor-pointer">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 border border-border-light">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                  {step.id}. {step.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        <section className="border-2 border-border rounded-lg bg-background hover:border-border-light transition-colors flex-[0.6] h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-text-primary">
              Main Content
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 border border-border-light">
              <Image
                src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=400&fit=crop"
                alt="Main content"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Featured Content
            </h3>
            <p className="text-text-secondary">
              This is the main content area with detailed information.
            </p>
          </div>
        </section>

        <section className="border-2 border-border rounded-lg bg-background hover:border-border-light transition-colors flex-[0.2] h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-text-primary">
              Details
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 border border-border-light">
                <Image
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop"
                  alt="Detail view"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-medium text-text-primary">
                Project Overview
              </h3>
            </div>
            <div>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 border border-border-light">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-medium text-text-primary">
                Team Collaboration
              </h3>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default page