import { NextApiRequest, NextApiResponse } from 'next';
import { ProjectService } from '../../../../scripts/services/project_service';
import { logger } from '../../../../scripts/utils/logger';

const projectService = new ProjectService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const project = projectService.getProject(id as string);
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }
      res.status(200).json(project);
    } else if (req.method === 'PUT') {
      const project = await projectService.updateProject(id as string, req.body);
      res.status(200).json(project);
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Error in project detail endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 