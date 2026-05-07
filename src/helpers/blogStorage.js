import { blogPosts } from '../data/blogPosts';

const STORAGE_KEY = 'bibliotecaVirtualCustomPosts';

const normalizeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const readCustomPosts = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const writeCustomPosts = (posts) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const getAllPosts = () => {
  const customPosts = readCustomPosts();
  return [...customPosts, ...blogPosts];
};

export const getPostBySlug = (slug) =>
  getAllPosts().find((post) => post.slug === slug);

export const createUniqueSlug = (title) => {
  const baseSlug = normalizeSlug(title) || 'nuevo-post';
  const allSlugs = new Set(getAllPosts().map((post) => post.slug));

  if (!allSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  let nextSlug = `${baseSlug}-${index}`;
  while (allSlugs.has(nextSlug)) {
    index += 1;
    nextSlug = `${baseSlug}-${index}`;
  }

  return nextSlug;
};

export const saveCustomPost = (post) => {
  const currentPosts = readCustomPosts();
  writeCustomPosts([post, ...currentPosts]);
};

export const deleteCustomPost = (slug, authorId) => {
  const currentPosts = readCustomPosts();
  const nextPosts = currentPosts.filter(
    (post) => !(post.slug === slug && post.authorId === authorId),
  );
  writeCustomPosts(nextPosts);
};
