const http = require('node:http');

const PORT = 3000;

const enforceOwnership =
  process.env.ENFORCE_OWNERSHIP === 'true';

const usersByToken = new Map([
  [
    'alice-lab-token',
    {
      id: 'user-100',
      name: 'Alice',
    },
  ],
  [
    'bob-lab-token',
    {
      id: 'user-200',
      name: 'Bob',
    },
  ],
]);

const invoices = new Map([
  [
    'INV-1001',
    {
      id: 'INV-1001',
      ownerId: 'user-100',
      description: 'Fatura de Alice',
      amount: 150,
    },
  ],
  [
    'INV-2001',
    {
      id: 'INV-2001',
      ownerId: 'user-200',
      description: 'Fatura de Bob',
      amount: 900,
    },
  ],
]);

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });

  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(
    req.url,
    `http://${req.headers.host || 'localhost'}`
  );

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, {
      status: 'ok',
    });
  }

  const isMeRoute = url.pathname === '/api/me';

  const invoiceMatch = url.pathname.match(
    /^\/api\/invoices\/([^/]+)$/
  );

  if (
    req.method !== 'GET' ||
    (!isMeRoute && !invoiceMatch)
  ) {
    return sendJson(res, 404, {
      error: 'Route not found',
    });
  }

  const authorization = req.headers.authorization || '';

  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);

  const user = tokenMatch
    ? usersByToken.get(tokenMatch[1])
    : null;

  if (!user) {
    return sendJson(res, 401, {
      error: 'Unauthorized',
    });
  }

  if (isMeRoute) {
    return sendJson(res, 200, {
      user,
    });
  }

  let invoiceId;

  try {
    invoiceId = decodeURIComponent(invoiceMatch[1]);
  } catch {
    return sendJson(res, 400, {
      error: 'Invalid invoice identifier',
    });
  }

  const invoice = invoices.get(invoiceId);

  if (!invoice) {
    return sendJson(res, 404, {
      error: 'Invoice not found',
    });
  }

  if (
    enforceOwnership &&
    invoice.ownerId !== user.id
  ) {
    return sendJson(res, 404, {
      error: 'Invoice not found',
    });
  }

  return sendJson(res, 200, {
    invoice,
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Ownership enforcement: ${enforceOwnership}`);
});