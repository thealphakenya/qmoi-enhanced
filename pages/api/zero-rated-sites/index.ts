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

function getZeroRatedSites(): ZeroRatedSite[] {
  return zeroRatedSites;
}

function createZeroRatedSite(siteData: Omit<ZeroRatedSite, 'id'>): ZeroRatedSite {
  const site: ZeroRatedSite = {
    id: `site_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...siteData,
  };
  zeroRatedSites.push(site);
  return site;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: getZeroRatedSites(),
      count: zeroRatedSites.length,
    });
  }

  if (req.method === 'POST') {
    const body = req.body;
    const requiredFields = ['name', 'urls', 'category', 'continents', 'countries'];

    for (const field of requiredFields) {
      if (!body?.[field]) {
        return res.status(400).json({ success: false, error: `Missing required field: ${field}` });
      }
    }

    const newSite = createZeroRatedSite({
      name: body.name,
      domain: body.domain || '',
      urls: body.urls,
      category: body.category,
      continents: body.continents,
      countries: body.countries,
      regions: body.regions || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      globalAccess: body.globalAccess !== undefined ? body.globalAccess : false,
    });

    return res.status(201).json({ success: true, data: newSite, message: 'Zero-rated site created successfully' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
