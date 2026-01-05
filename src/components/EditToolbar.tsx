'use client'

interface EditToolbarProps {
  onSave: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function EditToolbar({ onSave, onCancel, isLoading = false }: EditToolbarProps) {
  return (
    <div className="fixed top-20 left-0 right-0 bg-gradient-to-r from-indigo-600 to-pink-600 z-40 shadow-lg">
      <div className="container-custom flex justify-between items-center py-4">
        <div className="text-white font-bold text-lg">✏️ Editing Mode - Edit your content</div>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Saving...
              </>
            ) : (
              '✓ Save'
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
