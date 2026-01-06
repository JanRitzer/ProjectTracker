/**
 * Generate consistent colors for tags based on tag name
 */

const TAG_COLORS = [
  { bg: '#dbeafe', text: '#1e40af' }, // blue
  { bg: '#dcfce7', text: '#15803d' }, // green
  { bg: '#fce7f3', text: '#9f1239' }, // pink
  { bg: '#fef3c7', text: '#a16207' }, // yellow
  { bg: '#f3e8ff', text: '#6b21a8' }, // purple
  { bg: '#ffedd5', text: '#c2410c' }, // orange
  { bg: '#e0e7ff', text: '#4338ca' }, // indigo
  { bg: '#fecdd3', text: '#be123c' }  // rose
];

/**
 * Get color for a tag based on its name (consistent hashing)
 * @param {string} tagName - The tag name
 * @returns {Object} Object with bg and text color
 */
export function getTagColor(tagName) {
  if (!tagName) return TAG_COLORS[0];

  // Simple hash function for consistent color assignment
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}
