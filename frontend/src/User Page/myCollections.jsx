import { useState } from "react";
import { CreateCollectionModal } from "./CreateCollectionModal";

export function MyCollections() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-center font-semibold text-white">
        My Collections
      </h2>

      <button
        onClick={() => setOpen(true)}
        className="
   mt-3 w-fit px-3 py-2 rounded-lg
    bg-purple-400 text-black text-sm font-medium
    hover:bg-purple-500 relative top-40 -left-60
  "
      >
        + Create Collection
      </button>

      <CreateCollectionModal open={open} setOpen={setOpen} />
    </div>
  );
}
