export default function ClearButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Clear
    </button>
  );
}
