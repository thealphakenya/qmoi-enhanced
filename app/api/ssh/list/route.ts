// API endpoint to list files/directories over SSH
import { NextRequest, NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(req: NextRequest) {
  const { path, host, port, username, password } = await req.json();
  const ssh = new NodeSSH();
  try {
    await ssh.connect({ host, port, username, password });
    const sftp = await ssh.requestSFTP();
    const readdir = (path: string) => new Promise<any[]>((resolve, reject) => {
      sftp.readdir(path, (err: any, list: any[]) => {
        if (err) reject(err); else resolve(list);
      });
    });
    const files = await readdir(path);
    ssh.dispose();
    return NextResponse.json({ files: files.map((f: any) => ({ filename: f.filename, longname: f.longname, attrs: f.attrs })) });
  } catch (err: any) {
    ssh.dispose();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
