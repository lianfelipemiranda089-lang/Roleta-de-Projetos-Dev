import { Router } from 'express';
import {
  getGuideBySlug,
  getStats,
  listGuides,
  listPillars
} from '../services/guides.service.js';
import {
  getLibraryItemBySlug,
  getLibraryStats,
  listLibrary
} from '../services/library.service.js';

const router = Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    ...getStats(),
    ...getLibraryStats()
  });
});

router.get(
  '/pillars',
  asyncHandler(async (_req, res) => {
    const pillars = await listPillars();
    res.json({ total: pillars.length, pillars });
  })
);

router.get(
  '/guides',
  asyncHandler(async (req, res) => {
    const guides = await listGuides({
      pillar: req.query.pillar,
      level: req.query.level,
      q: req.query.q
    });
    res.json({ total: guides.length, guides });
  })
);

router.get(
  '/guides/:slug',
  asyncHandler(async (req, res) => {
    const guide = await getGuideBySlug(req.params.slug);
    res.json({ guide });
  })
);

router.get(
  '/library',
  asyncHandler(async (req, res) => {
    const { categories, items } = await listLibrary({
      category: req.query.category,
      q: req.query.q
    });
    res.json({ total: items.length, categories, items });
  })
);

router.get(
  '/library/:slug',
  asyncHandler(async (req, res) => {
    const item = await getLibraryItemBySlug(req.params.slug);
    res.json({ item });
  })
);

export default router;