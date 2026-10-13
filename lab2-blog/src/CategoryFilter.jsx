function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="filter-row">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`filter-btn ${c === active ? 'active' : ''}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
