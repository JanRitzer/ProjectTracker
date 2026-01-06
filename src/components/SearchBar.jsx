import styles from './SearchBar.module.css';

export function SearchBar({ value, onChange, placeholder = "Search tasks..." }) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={styles.searchBar}>
      <svg
        className={styles.searchIcon}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button
          onClick={handleClear}
          className={styles.clearBtn}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
