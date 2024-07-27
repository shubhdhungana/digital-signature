export default function UndoButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-yellow-500 text-white rounded"
    >
      Undo
    </button>
  );
}
