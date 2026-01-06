import { useState } from 'react';
import { TagList } from './TagList';
import styles from './TagInput.module.css';

export function TagInput({ tags = [], onChange, maxTags = 10 }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmedTag = inputValue.trim();

    if (!trimmedTag) return;

    // Check if tag already exists (case-insensitive)
    if (tags.some(tag => tag.toLowerCase() === trimmedTag.toLowerCase())) {
      alert('This tag already exists');
      setInputValue('');
      return;
    }

    // Check max tags limit
    if (tags.length >= maxTags) {
      alert(`Maximum ${maxTags} tags allowed`);
      return;
    }

    // Check tag length
    if (trimmedTag.length > 20) {
      alert('Tag name must be 20 characters or less');
      return;
    }

    onChange([...tags, trimmedTag]);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={styles.tagInput}>
      <TagList tags={tags} maxVisible={100} onRemove={handleRemoveTag} editable={true} />
      <div className={styles.inputRow}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a tag and press Enter..."
          className={styles.input}
          maxLength={20}
        />
        <button
          type="button"
          onClick={handleAddTag}
          className={styles.addBtn}
          disabled={!inputValue.trim()}
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className={styles.hint}>
          {tags.length}/{maxTags} tags
        </div>
      )}
    </div>
  );
}
