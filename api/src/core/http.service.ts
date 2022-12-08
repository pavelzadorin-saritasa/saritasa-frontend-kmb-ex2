import * as http from 'http';
import { ViewDef } from '../utils/types/view-def';
import { LoginView } from '../views/login.view';

/** Helper class unite supported HTTP methods. */
type SupportedMethod = 'POST' | 'GET';

/**
 * Type guard verifies requested method is supported by server. 
 * @param method Requested HTTP method.
 * @returns Is method supported or not.
 */
function isMethodSupported(method?: string): method is SupportedMethod {
  return method === 'POST' || method === 'GET';
}

/**
 * Map requested URL with actual view implementations and HTTP methods managed by this view.
 * Simplest variant of routing.
 * @param url Requested URL.
 * @returns List of HTTP methods allowed for specified view with view function itself.
 */
function routeToViews(url: string): Partial<Record<SupportedMethod, ViewDef>> | null {
  switch (url) {
    case '/auth/login/':
      return { 'POST': LoginView };
  }

  return null; 
}

/**
 * Collect and combine request body into single object.
 * @param req Incoming message request.
 * @return Entire request body object.
 */
async function getRequestBody(req: http.IncomingMessage) {
  const task = new Promise<string>((resolve) => {
    let body: Uint8Array[] = [];
    req.on('data', (chunk: Uint8Array) => {
      body.push(chunk);
    }).on('end', () => {
      resolve(Buffer.concat(body).toString());
    });
  })
  
  return await task;
}

/**
 * Processing incoming requests.
 * @param req Incoming message request.
 * @param res Server response object.
 */
async function requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
  console.log('request: ', req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url) {
    const views = routeToViews(req.url);

    if (views && req.method == 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Methods', Object.keys(views).join(','));
      res.writeHead(204);
      res.end();
      return;
    }

    res.setHeader('Content-type', 'application/json');

    if (views && isMethodSupported(req.method) && Object.keys(views).includes(req.method)) {
      try {
        let body: string | null = null;
        if (req.method === 'POST') {
          body = await getRequestBody(req);
        }

        const viewContent = await views[req.method]?.(body);
        if (viewContent !== null) {
          res.writeHead(200);
          res.end(viewContent);
          return;
        }
      } catch (e: unknown) {
        res.writeHead(500);
        res.end(JSON.stringify({ detail: 'Internal server error.', details: e }));
        return;
      }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ detail: 'Resource not found.' }));
  }
}

const server = http.createServer(requestListener);

/** Start HTTP server. */
export function startServer() {
  const host = process.env.HTTPHOST;
  const port = process.env.HTTPPORT;
  
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}
