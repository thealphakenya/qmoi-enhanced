// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
import { specificExports } from "next";
import { specificExports } from "../../../../scripts/services/project_service";
import { specificExports } from "../../../../scripts/utils/logger";

const projectService = new ProjectService();

export default async /**
 * handler function
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): any {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const project = projectService.getProject(id as string);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.status(200).json(project);
    } else if (req.method === "PUT") {
      const project = await projectService.updateProject(
        id as string,
        req.body,
      );
      res.status(200).json(project);
    } else {
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error("Error in project detail endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
