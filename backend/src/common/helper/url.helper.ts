export const getDownloadUrl = (filename: string): string => {
  if (!filename) {
    return undefined;
  }

  if (filename.includes('http')) return filename;
  const host = process.env.HOST || 'http://localhost';
  const port = process.env.PORT || '3000';
  const baseUrl = host.startsWith('http') ? host : `http://${host}`;

  if (filename.startsWith('/')) return `${baseUrl}:${port}/download${filename}`;
  else return `${baseUrl}:${port}/download/${filename}`;
};
