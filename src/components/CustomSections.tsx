'use client'

import { CustomSection } from '@/data/portfolio'

interface CustomSectionsProps {
  sections: CustomSection[]
}

export default function CustomSections({ sections }: CustomSectionsProps) {
  if (!sections || sections.length === 0) {
    return null
  }

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
                {section.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  )
}