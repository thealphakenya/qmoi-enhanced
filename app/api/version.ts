import type { NextApiRequest, NextApiResponse } from 'next';
import { RELEASES } from '@/components/release-notes';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Always return the latest release info
  res.status(200).json({
    version: RELEASES[0].version,
    date: RELEASES[0].date,
    notes: RELEASES[0].notes,
    downloads: RELEASES[0].downloads
  });
}
