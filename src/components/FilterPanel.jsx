import { useState } from 'react';
import { getTagColor } from '../utils/tagColors';
import { countActiveFilters } from '../utils/filterHelpers';
import styles from './FilterPanel.module.css';

export function FilterPanel({ filters, onChange, availableTags }) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = countActiveFilters(filters);

  const handlePriorityToggle = (priority) => {
    const current = filters.priority || [];
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority];
    onChange({ ...filters, priority: updated });
  };

  const handleTagToggle = (tag) => {
    const current = filters.tags || [];
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onChange({ ...filters, tags: updated });
  };

  const handleDueDateToggle = (option) => {
    const current = filters.dueDate || [];
    const updated = current.includes(option)
      ? current.filter(d => d !== option)
      : [...current, option];
    onChange({ ...filters, dueDate: updated });
  };

  const handleClearAll = () => {
    onChange({ priority: [], tags: [], dueDate: [] });
  };

  return (
    <div className={styles.filterPanel}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleBtn}
      >
        <span>Filters</span>
        {activeCount > 0 && (
          <span className={styles.badge}>{activeCount}</span>
        )}
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.panel}>
          {/* Priority Filter */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Priority</h4>
            <div className={styles.checkboxGroup}>
              {['high', 'medium', 'low'].map(priority => (
                <label key={priority} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={(filters.priority || []).includes(priority)}
                    onChange={() => handlePriorityToggle(priority)}
                  />
                  <span className={styles.checkboxLabel}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Tags</h4>
              <div className={styles.tagChips}>
                {availableTags.map(tag => {
                  const { bg, text } = getTagColor(tag);
                  const isSelected = (filters.tags || []).includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`${styles.tagChip} ${isSelected ? styles.tagChipActive : ''}`}
                      style={{
                        backgroundColor: isSelected ? bg : '#f3f4f6',
                        color: isSelected ? text : '#6b7280'
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Due Date Filter */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Due Date</h4>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={(filters.dueDate || []).includes('overdue')}
                  onChange={() => handleDueDateToggle('overdue')}
                />
                <span className={styles.checkboxLabel}>Overdue</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={(filters.dueDate || []).includes('dueSoon')}
                  onChange={() => handleDueDateToggle('dueSoon')}
                />
                <span className={styles.checkboxLabel}>Due Soon (3 days)</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={(filters.dueDate || []).includes('noDueDate')}
                  onChange={() => handleDueDateToggle('noDueDate')}
                />
                <span className={styles.checkboxLabel}>No Due Date</span>
              </label>
            </div>
          </div>

          {/* Clear All Button */}
          {activeCount > 0 && (
            <button onClick={handleClearAll} className={styles.clearBtn}>
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
