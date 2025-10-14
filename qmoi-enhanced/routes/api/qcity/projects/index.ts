import { NextApiRequest, NextApiResponse } from "next";
import { ProjectService } from "../../../../scripts/services/project_service";
import { logger } from "../../../../scripts/utils/logger";

const projectService = new ProjectService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const projects = projectService.getProjects();
      res.status(200).json(projects);
    } else if (req.method === "POST") {
      const project = await projectService.createProject(req.body);
      res.status(201).json(project);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error("Error in projects endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
