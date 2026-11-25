// Kolom pencarian dengan ikon kaca pembesar
export default function SearchBar({ value, onChange, placeholder = 'Cari...' }) {
  return (
    <div className="relative w-full sm:w-80">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <svg
          className="h-4 w-4 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input pl-9"
      />
    </div>
  );
}
