interface ServerConfigType {
  protocol: string;
  host: string;
  port: number;
  staticUrl: string;
  staticPath: string;
}

const protocol = 'http://';
const host = 'localhost';
const port = 3333;
const staticPath = '/files';
const staticUrl = `${protocol}${host}:${port}${staticPath}/`;

export const serverConfig: ServerConfigType = {
  protocol,
  host,
  port,
  staticUrl,
  staticPath,
};

export default { serverConfig };