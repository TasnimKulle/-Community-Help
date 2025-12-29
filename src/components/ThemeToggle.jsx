export default function ThemeToggle() {
  return (
    <button
      onClick={() => document.documentElement.classList.toggle("dark")}
      className="px-3 py-1 border rounded"
    >
      🌙
    </button>
  );
}
