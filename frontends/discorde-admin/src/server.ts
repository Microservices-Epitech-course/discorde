/* eslint-disable @typescript-eslint/no-floating-promises */
import compression from 'compression';
import express from 'express';
import next from 'next';
import { format, parse } from 'url';

const port = process.env.PORT || 3002;
const app = next({});
const handle = app.getRequestHandler();

app.prepare().then((): void => {
  const server = express();
  server.use(compression());

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  server.get('*', (req, res) => {
    const { pathname, query } = parse(req.url, true);

    if (
      typeof pathname === 'string' &&
      pathname.length > 1 &&
      pathname.slice(-1) === '/' &&
      pathname.indexOf('/_next/') !== 0
    ) {
      const myformat = format({
        pathname: pathname.slice(0, -1),
        query,
      });
      return res.redirect(myformat);
    }
    return handle(req, res);
  });

  server.listen(port, (): void => {
    // eslint-disable-next-line no-console
    console.log('Ready on port', port);
  });
});
