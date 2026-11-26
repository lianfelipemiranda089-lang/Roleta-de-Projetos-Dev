import { Router } from 'express';
import {
  getGuideBySlug,
  getStats,
  listGuides,
  listPillars
} from '../services/guides.service.js';

const router = Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/health', (_req, res) => {
  const stats = getStats();
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    ...stats
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
    const pillar = typeof req.query.pillar === 'string' ? req.query.pillar : undefined;
    const level = typeof req.query.level === 'string' ? req.query.level : undefined;
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;

    const guides = await listGuides({ pillar, level, q });
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

export default router;