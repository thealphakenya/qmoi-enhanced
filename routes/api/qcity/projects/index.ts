// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:16Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability


const projectService = new ProjectService();

export default async /**
 * handler function
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): any {
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
