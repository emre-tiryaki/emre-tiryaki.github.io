function ProjectFilter({ tags, activeTag, onSelect }) {
  return (
    <div className="filter-bar" id="project-filter">
      {tags.map(tag => (
        <button
          key={tag}
          className={`filter-btn${activeTag === tag ? ' active' : ''}`}
          onClick={() => onSelect(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default ProjectFilter;
