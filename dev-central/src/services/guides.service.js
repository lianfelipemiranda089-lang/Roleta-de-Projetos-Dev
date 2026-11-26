import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

let state = {
  loaded: false,
  pillars: [],
  guides: [],
  guidesBySlug: new Map()
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

function sanitizeResources(resources) {
  if (!Array.isArray(resources)) return [];
  const clean = [];

  for (const item of resources) {
    if (!item || typeof item.url !== 'string' || typeof item.name !== 'string') {
      continue;
    }
    try {
      const parsed = new URL(item.url);
      if (parsed.protocol !== 'https:') continue;

      clean.push({
        name: item.name.trim(),
        url: parsed.href,
        category: typeof item.category === 'string' ? item.category.trim() : 'Referência',
        description: typeof item.description === 'string' ? item.description.trim() : ''
      });
    } catch {
      continue;
    }
  }

  return clean;
}

export async function loadKnowledgeBase({ force = false } = {}) {
  if (state.loaded && !force) {
    return state;
  }

  if (loadingPromise && !force) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    const nextPillars = [];
    const nextGuides = [];
    const nextGuidesBySlug = new Map();

    const pillarsPath = path.join(env.DATA_DIR, 'pillars.json');
    try {
      const parsedPillars = await readJsonSafe(pillarsPath);
      if (Array.isArray(parsedPillars)) {
        nextPillars.push(...parsedPillars);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.warn(JSON.stringify({
          level: 'warn',
          event: 'data.pillars.invalid',
          message: err.message
        }));
      }
    }

    try {
      const entries = await fs.readdir(env.GUIDES_DIR, { withFileTypes: true });
      const jsonFiles = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
        .map((entry) => entry.name)
        .sort();

      const resolvedBase = path.resolve(env.GUIDES_DIR) + path.sep;

      for (const fileName of jsonFiles) {
        const fullPath = path.resolve(env.GUIDES_DIR, fileName);
        if (!fullPath.startsWith(resolvedBase)) {
          continue;
        }

        try {
          const guide = await readJsonSafe(fullPath);
          if (!guide || typeof guide.slug !== 'string' || !SLUG_REGEX.test(guide.slug)) {
            continue;
          }

          const sanitizedGuide = {
            ...guide,
            resources: sanitizeResources(guide.resources)
          };

          nextGuides.push(sanitizedGuide);
          nextGuidesBySlug.set(sanitizedGuide.slug, sanitizedGuide);
        } catch (fileErr) {
          console.warn(JSON.stringify({
            level: 'warn',
            event: 'data.guide.invalid',
            file: fileName,
            message: fileErr.message
          }));
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    state = {
      loaded: true,
      pillars: nextPillars,
      guides: nextGuides,
      guidesBySlug: nextGuidesBySlug
    };

    return state;
  })();

  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export function getStats() {
  return {
    pillarsCount: state.pillars.length,
    guidesCount: state.guides.length
  };
}

export async function listPillars() {
  await loadKnowledgeBase();
  return state.pillars;
}

export async function listGuides({ pillar, level, q } = {}) {
  await loadKnowledgeBase();

  if (Array.isArray(pillar) || Array.isArray(level) || Array.isArray(q)) {
    throw new AppError(400, 'INVALID_QUERY_PARAM', 'Parâmetros de filtro duplicados não são permitidos.');
  }

  const normalizedPillar = typeof pillar === 'string' ? pillar.trim().toLowerCase() : '';
  const normalizedLevel = typeof level === 'string' ? level.trim().toLowerCase() : '';
  const normalizedQuery = typeof q === 'string' ? q.trim().toLowerCase() : '';

  if (normalizedQuery.length > 100) {
    throw new AppError(400, 'QUERY_TOO_LONG', 'O termo de busca deve ter no máximo 100 caracteres.');
  }

  return state.guides
    .filter((guide) => {
      if (normalizedPillar && String(guide.pillar || '').toLowerCase() !== normalizedPillar) {
        return false;
      }
      if (normalizedLevel && String(guide.level || '').toLowerCase() !== normalizedLevel) {
        return false;
      }
      if (normalizedQuery) {
        const haystack = [
          guide.title,
          guide.summary,
          ...(Array.isArray(guide.tags) ? guide.tags : [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      }
      return true;
    })
    .map(({ slug, title, pillar: guidePillar, level: guideLevel, summary, tags }) => ({
      slug,
      title,
      pillar: guidePillar,
      level: guideLevel,
      summary,
      tags: Array.isArray(tags) ? tags : []
    }));
}

export async function getGuideBySlug(slug) {
  if (typeof slug !== 'string' || !SLUG_REGEX.test(slug)) {
    throw new AppError(400, 'INVALID_SLUG', 'Formato de identificador do guia inválido.');
  }

  await loadKnowledgeBase();
  const guide = state.guidesBySlug.get(slug);

  if (!guide) {
    throw new AppError(404, 'GUIDE_NOT_FOUND', `Guia '${slug}' não encontrado.`);
  }

  return guide;
}