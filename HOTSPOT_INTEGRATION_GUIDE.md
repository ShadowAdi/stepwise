## Integration Guide: Adding Hotspots to Your Steps Page

### Quick Integration (Add to Preview Section)

Replace your preview section with this code:

```tsx
import { HotspotEditor } from '@/components/dashboard/HotspotEditor';

// In your render (replace the preview section):
<section className="border-2 border-border rounded-lg bg-background hover:border-border-light transition-colors flex-[0.3] h-full flex flex-col overflow-hidden">
  <div className="p-6 border-b border-border">
    <h2 className="text-2xl font-semibold text-text-primary">
      {selectedStep ? 'Step Preview & Hotspots' : 'Live Preview'}
    </h2>
  </div>
  <div className="flex-1 overflow-y-auto p-6">
    {selectedStep && token ? (
      <HotspotEditor
        step={selectedStep}
        token={token}
        allSteps={steps}
        onHotspotsChange={(hotspots) => {
          console.log('Hotspots updated:', hotspots);
        }}
      />
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No Step Selected
        </h3>
        <p className="text-text-muted text-sm">
          Click on a step from the left to preview it here
        </p>
      </div>
    )}
  </div>
</section>
```

### User Flow:
1. ✅ User creates a step (title, description, image)
2. ✅ Step appears in left sidebar
3. ✅ User clicks on step to select it
4. ✅ Preview shows on the right with "Add Hotspots" button
5. ✅ User clicks "Add Hotspots" to enter edit mode
6. ✅ User draws rectangles on image to create hotspots
7. ✅ Each hotspot is saved immediately to database
8. ✅ User can add tooltip text and link to other steps
9. ✅ User clicks "Done Editing" when finished

### Alternative: Separate Hotspot Page

Create `app/(protected)/dashboard/[id]/steps/[stepId]/hotspots/page.tsx`:

```tsx
import { HotspotEditor } from '@/components/dashboard/HotspotEditor';

export default function HotspotManagementPage() {
  // Fetch step data
  // Render HotspotEditor
}
```

Then add a "Manage Hotspots" button to each step card.

---

**Which approach do you prefer?**
- Option A: Integrated in preview (simpler, single page)
- Option B: Separate hotspot management page (cleaner separation)
