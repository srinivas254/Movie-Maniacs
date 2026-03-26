
export function ConfirmModal({ onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 bg-black/70
                 flex items-center justify-center z-50"
    >
      <div
        className="bg-zinc-900 p-6 rounded-xl
                   w-[320px] text-center"
      >
        <h3 className="text-lg font-semibold mb-3">
          Are you absolutely sure?
        </h3>

        <p className="text-gray-400 text-sm mb-6">
          Your account and all data will be permanently removed.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
