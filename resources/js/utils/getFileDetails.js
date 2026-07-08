export const getFileDetails = (url, fallbackType = 'text') => {
    if (!url) {
        if (fallbackType?.toLowerCase() === 'video') return { icon: 'movie', bgClass: 'bg-secondary', textClass: 'text-white' };
        return { icon: 'description', bgClass: 'bg-primary', textClass: 'text-white' };
    }
    
    const extension = url.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
        return { icon: 'image', bgClass: 'bg-tertiary', textClass: 'text-white' };
    }
    if (['pdf'].includes(extension)) {
        return { icon: 'picture_as_pdf', bgClass: 'bg-error', textClass: 'text-white' };
    }
    if (['mp4', 'webm', 'avi', 'mov', 'mkv'].includes(extension)) {
        return { icon: 'movie', bgClass: 'bg-secondary', textClass: 'text-white' };
    }
    if (['mp3', 'wav', 'ogg'].includes(extension)) {
        return { icon: 'audiotrack', bgClass: 'bg-primary', textClass: 'text-white' };
    }
    if (['zip', 'rar', 'tar', 'gz', '7z'].includes(extension)) {
        return { icon: 'folder_zip', bgClass: 'bg-surface-variant', textClass: 'text-on-surface-variant' };
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        return { icon: 'description', bgClass: 'bg-primary', textClass: 'text-white' };
    }
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return { icon: 'table_view', bgClass: 'bg-secondary', textClass: 'text-white' };
    }
    
    if (fallbackType?.toLowerCase() === 'video') {
        return { icon: 'movie', bgClass: 'bg-secondary', textClass: 'text-white' };
    }
    
    return { icon: 'description', bgClass: 'bg-primary', textClass: 'text-white' };
};
