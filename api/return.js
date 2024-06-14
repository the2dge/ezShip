export default (req, res) => {
  const { query, url } = req;

  // Log the full URL to see what is being received
  console.log('998 Full request URL:', req.url);

  // Log the query parameters
  console.log('Query parameters:', query);

  const ezShipData = {
    stName: query.stName,
    stAddr: query.stAddr,
    stCate: query.stCate,
    stCode: query.stCode,
  };

  // Log the ezShipData object
  console.log('ezShipData:', ezShipData);

  const redirectUrl = `https://ez-ship.vercel.app/index.html?${new URLSearchParams(ezShipData).toString()}`;
  res.redirect(redirectUrl);
};
