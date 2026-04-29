import { NextApiRequest, NextApiResponse } from 'next';

type ZeroRatedSite = {
  id: string;
  name: string;
  domain: string;
  urls: string[];
  category: string;
  continents: string[];
  countries: string[];
  regions: string[];
  isActive: boolean;
  globalAccess: boolean;
};

const zeroRatedSites: ZeroRatedSite[] = [];

function findSite(id: string): ZeroRatedSite | undefined {
  return zeroRatedSites.find((site) => site.id === id);
}

function updateSite(id: string, data: Partial<ZeroRatedSite>): ZeroRatedSite | null {
  const site = findSite(id);
  if (!site) return null;

  Object.assign(site, data);
  return site;
}

function deleteSite(id: string): boolean {
  const index = zeroRatedSites.findIndex((site) => site.id === id);
  if (index === -1) return false;
  zeroRatedSites.splice(index, 1);
  return true;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!siteId) {
    return res.status(400).json({ success: false, error: 'Missing site id' });
  }

  if (req.method === 'GET') {
    const site = findSite(siteId);
    if (!site) {
      return res.status(404).json({ success: false, error: 'Zero-rated site not found' });
    }

    return res.status(200).json({ success: true, data: { site, stats: { hits: 0, globalReach: 0 } } });
  }

  if (req.method === 'PUT') {
    const updatedSite = updateSite(siteId, req.body);
    if (!updatedSite) {
      return res.status(404).json({ success: false, error: 'Zero-rated site not found' });
    }

    return res.status(200).json({ success: true, data: updatedSite, message: 'Zero-rated site updated successfully' });
  }

  if (req.method === 'DELETE') {
    const deleted = deleteSite(siteId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Zero-rated site not found' });
    }

    return res.status(200).json({ success: true, message: 'Zero-rated site deleted successfully' });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
