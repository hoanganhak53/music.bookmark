const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

exports.handler = async (event, context) => {
  try {
    await app.prepare();

    const { httpMethod, path, queryStringParameters, headers, body } = event;

    // Create a mock request/response for Next.js
    const url = parse(path, true);
    url.query = queryStringParameters || {};

    const req = {
      method: httpMethod,
      url: path,
      headers: headers || {},
      body: body,
    };

    let responseBody = '';
    let responseHeaders = {};
    let statusCode = 200;

    const res = {
      writeHead: (status, headers) => {
        statusCode = status;
        responseHeaders = headers || {};
      },
      write: (chunk) => {
        responseBody += chunk;
      },
      end: (chunk) => {
        if (chunk) responseBody += chunk;
      },
      setHeader: (name, value) => {
        responseHeaders[name] = value;
      },
    };

    await handle(req, res, url);

    return {
      statusCode,
      headers: responseHeaders,
      body: responseBody,
    };
  } catch (error) {
    console.error('Error in Netlify handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        details: error.message,
      }),
    };
  }
};
