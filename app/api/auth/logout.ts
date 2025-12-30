/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-undef, no-case-declarations, no-empty, no-useless-escape */
/* global Request, Headers, Buffer, URLSearchParams, TextDecoder, TextEncoder */
import { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ success: true });
}
