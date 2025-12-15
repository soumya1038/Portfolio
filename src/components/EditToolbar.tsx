'use client'

interface EditToolbarProps {
  onSave: () => void
  onCancel: () => void
}

export default function EditToolbar({ onSave, onCancel }: EditToolbarProps) {
  return (
    <div className="fixed top-20 left-0 right-0 bg-gradient-to-r from-indigo-600 to-pink-600 z-40 shadow-lg">
      <div className="container-custom flex justify-between items-center py-4">
        <div className="text-white font-bold text-lg">✏️ Editing Mode - Edit your content</div>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            ✓ Save
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
