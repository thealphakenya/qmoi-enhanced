import { NextApiRequest, NextApiResponse } from 'next';
import { ProjectService } from '../../../../../scripts/services/project_service';
import { logger } from '../../../../../scripts/utils/logger';

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
      res.status(200).json(project.tasks);
    } else if (req.method === 'POST') {
      const task = await projectService.addTask(id as string, req.body);
      res.status(201).json(task);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Error in project tasks endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 