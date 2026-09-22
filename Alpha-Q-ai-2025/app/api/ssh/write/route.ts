// API endpoint to write a file over SSH
import { NextRequest, NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(req: NextRequest) {
  const { filePath, content, host, port, username, password } = await req.json();
  const ssh = new NodeSSH();
  try {
    await ssh.connect({ host, port, username, password });
    const sftp = await ssh.requestSFTP();
    const writeFile = (filePath: string, content: string) => new Promise<void>((resolve, reject) => {
      sftp.writeFile(filePath, Buffer.from(content), (err: any) => {
        if (err) reject(err); else resolve();
      });
    });
    await writeFile(filePath, content);
    ssh.dispose();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    ssh.dispose();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
