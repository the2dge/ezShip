export default (req, res) => {
  const { method, query } = req;

  // Log the request method
  console.log('Request method:', method);

  // Handle GET and POST requests
  let ezShipData;
  if (method === 'GET') {
    ezShipData = {
      stName: query.stName,
      stAddr: query.stAddr,
      stCate: query.stCate,
      stCode: query.stCode,
    };
  } else if (method === 'POST') {
    const body = req.body;
    ezShipData = {
      stName: body.stName,
      stAddr: body.stAddr,
      stCate: body.stCate,
      stCode: body.stCode,
    };
  } else {
    return res.status(405).send('Method Not Allowed');
  }

  // Log the ezShipData object
  console.log('ezShipData:', ezShipData);

  const redirectUrl = `https://ez-ship.vercel.app/index.html?${new URLSearchParams(ezShipData).toString()}`;
  res.redirect(redirectUrl);
};
