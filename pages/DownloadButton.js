export default function DownloadButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-green-500 text-white rounded"
    >
      Download
    </button>
  );
}
