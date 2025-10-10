// API endpoint to read a file over SSH
import { NextRequest, NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(req: NextRequest) {
  const { filePath, host, port, username, password } = await req.json();
  const ssh = new NodeSSH();
  try {
    await ssh.connect({ host, port, username, password });
    const sftp = await ssh.requestSFTP();
    const readFile = (filePath: string) => new Promise<any>((resolve, reject) => {
      sftp.readFile(filePath, (err: any, data: any) => {
        if (err) reject(err); else resolve(data);
      });
    });
    const data = await readFile(filePath);
    ssh.dispose();
    return NextResponse.json({ content: data.toString() });
  } catch (err: any) {
    ssh.dispose();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
