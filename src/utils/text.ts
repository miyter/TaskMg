/**
 * Strip HTML tags from a string.
 * Used for displaying rich text content in plain text areas (e.g. previews).
 */
export const stripHtml = (html: string | null | undefined): string => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
};
