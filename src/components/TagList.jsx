import { getTagColor } from '../utils/tagColors';
import styles from './TagList.module.css';

export function TagList({ tags, maxVisible = 3, onRemove, editable = false }) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  return (
    <div className={styles.tagList}>
      {visibleTags.map((tag, index) => {
        const { bg, text } = getTagColor(tag);
        return (
          <span
            key={index}
            className={styles.tag}
            style={{ backgroundColor: bg, color: text }}
          >
            {tag}
            {editable && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(tag);
                }}
                className={styles.removeBtn}
                aria-label={`Remove ${tag} tag`}
              >
                ×
              </button>
            )}
          </span>
        );
      })}
      {remainingCount > 0 && (
        <span className={styles.moreTag}>+{remainingCount} more</span>
      )}
    </div>
  );
}
