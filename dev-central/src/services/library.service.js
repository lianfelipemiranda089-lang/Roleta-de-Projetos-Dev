import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

let state = {
  loaded: false,
  items: [],
  bySlug: new Map(),
  categories: []
};

let loadingPromise = null;

function safeJsonReviver(key, value) {
  if (FORBIDDEN_KEYS.has(key)) {
    return undefined;
  }
  return value;
}

async function readJsonSafe(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw, safeJsonReviver);
}

export async function loadLibrary({ force = false } = {}) {
  if (state.loaded && !force) return state;
  if (loadingPromise && !force) return loadingPromise;

  loadingPromise = (async () => {
    const nextItems = [];
    const nextBySlug = new Map();
    const categoryCounts = new Map();

    try {
      const entries = await fs.readdir(env.LIBRARY_DIR, { withFileTypes: true });
      const jsonFiles = entries
        .filter((e) => e.isFile() && e.name.endsWith('.json'))
        .map((e) => e.name)
        .sort();

      const resolvedBase = path.resolve(env.LIBRARY_DIR) + path.sep;

      for (const fileName of jsonFiles) {
        const fullPath = path.resolve(env.LIBRARY_DIR, fileName);
        if (!fullPath.startsWith(resolvedBase)) continue;

        try {
          const item = await readJsonSafe(fullPath);
          if (!item || typeof item.slug !== 'string' || !SLUG_REGEX.test(item.slug)) {
            continue;
          }
          nextItems.push(item);
          nextBySlug.set(item.slug, item);

          const cat = String(item.category || 'Geral').trim();
          categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
        } catch (fileErr) {
          console.warn(JSON.stringify({
            level: 'warn',
            event: 'data.library.invalid',
            file: fileName,
            message: fileErr.message
          }));
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    const categories = Array.from(categoryCounts.entries()).map(([name, count]) => ({
      name,
      count
    }));

    state = {
      loaded: true,
      items: nextItems,
      bySlug: nextBySlug,
      categories
    };

    return state;
  })();

  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export function getLibraryStats() {
  return {
    libraryCount: state.items.length
  };
}

export async function listLibrary({ category, q } = {}) {
  await loadLibrary();

  if (Array.isArray(category) || Array.isArray(q)) {
    throw new AppError(400, 'INVALID_QUERY_PARAM', 'Parâmetros de filtro duplicados não são permitidos.');
  }

  const normCat = typeof category === 'string' ? category.trim().toLowerCase() : '';
  const normQ = typeof q === 'string' ? q.trim().toLowerCase() : '';

  if (normQ.length > 100) {
    throw new AppError(400, 'QUERY_TOO_LONG', 'O termo de busca deve ter no máximo 100 caracteres.');
  }

  const filtered = state.items.filter((item) => {
    if (normCat && String(item.category || '').toLowerCase() !== normCat) {
      return false;
    }
    if (normQ) {
      const refText = Array.isArray(item.references)
        ? item.references.map((r) => `${r.syntax || ''} ${r.description || ''}`).join(' ')
        : '';
      const haystack = [
        item.title,
        item.category,
        item.summary,
        ...(Array.isArray(item.tags) ? item.tags : []),
        refText
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normQ);
    }
    return true;
  });

  return {
    categories: state.categories,
    items: filtered.map(({ slug, title, category: itemCat, language, summary, tags, runnable }) => ({
      slug,
      title,
      category: itemCat,
      language,
      summary,
      tags: Array.isArray(tags) ? tags : [],
      runnable: Boolean(runnable)
    }))
  };
}

export async function getLibraryItemBySlug(slug) {
  if (typeof slug !== 'string' || !SLUG_REGEX.test(slug)) {
    throw new AppError(400, 'INVALID_SLUG', 'Identificador de item da biblioteca inválido.');
  }

  await loadLibrary();
  const item = state.bySlug.get(slug);

  if (!item) {
    throw new AppError(404, 'LIBRARY_ITEM_NOT_FOUND', `Item '${slug}' não encontrado na biblioteca.`);
  }

  return item;
}