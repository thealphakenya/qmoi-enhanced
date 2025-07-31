// lib/ssh-utils.ts
import { NodeSSH } from 'node-ssh';

interface SSHWriteParams {
  filePath: string;
  content: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export async function writeRemoteFile(params: SSHWriteParams): Promise<{ success?: boolean; error?: string }> {
  const { filePath, content, host, port, username, password } = params;
  const ssh = new NodeSSH();

  try {
    await ssh.connect({ host, port, username, password });
    const sftp = await ssh.requestSFTP();

    const writeFile = (path: string, data: string) =>
      new Promise<void>((resolve, reject) => {
        sftp.writeFile(path, Buffer.from(data), (err: any) => {
          err ? reject(err) : resolve();
        });
      });

    await writeFile(filePath, content);
    ssh.dispose();
    return { success: true };
  } catch (error: any) {
    ssh.dispose();
    return { error: error.message || 'Unknown SSH error' };
  }
}
