// 
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */

import { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req: NextApiRequest, _res: NextApiResponse) {
  _res.status(200).json({ success: true });
}
