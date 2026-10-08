// Shared by Next.js, public asset URLs, and the static production preview.
export const productionBasePath = '/sakthiram-portfolio';
export const basePath = process.env.NODE_ENV === 'production' ? productionBasePath : '';
