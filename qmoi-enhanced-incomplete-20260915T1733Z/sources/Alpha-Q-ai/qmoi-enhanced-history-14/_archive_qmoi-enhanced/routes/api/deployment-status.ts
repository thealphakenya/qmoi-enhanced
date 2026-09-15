import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: "Healthy",
    lastDeploy: "2024-06-01T12:34:56Z",
    health: "All systems operational",
    logs: [
      "Deployment started by admin at 2024-06-01T12:30:00Z",
      "Build completed successfully",
      "Deployment finished at 2024-06-01T12:34:56Z",
      "No errors detected",
    ],
    history: [
      {
        timestamp: "2024-06-01T12:34:56Z",
        status: "Success",
        version: "v1.2.3",
        duration: 296,
        filesChanged: 12,
        user: "admin",
      },
      {
        timestamp: "2024-05-30T09:20:10Z",
        status: "Failed",
        version: "v1.2.2",
        duration: 180,
        filesChanged: 8,
        user: "devops",
      },
      {
        timestamp: "2024-05-28T15:10:05Z",
        status: "Rollback",
        version: "v1.2.1",
        duration: 60,
        filesChanged: 0,
        user: "admin",
      },
      {
        timestamp: "2024-05-25T11:00:00Z",
        status: "Success",
        version: "v1.2.0",
        duration: 250,
        filesChanged: 10,
        user: "admin",
      },
    ],
  });
}
