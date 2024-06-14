export default (req, res) => {
  const { query } = req;

  console.log('Query parameters:', query); // Log the query parameters

  const ezShipData = {
    stName: query.stName,
    stAddr: query.stAddr,
    stCate: query.stCate,
    stCode: query.stCode,
  };

  console.log('ezShipData:', ezShipData); // Log the ezShipData object

  const redirectUrl = `https://ez-ship.vercel.app/index.html?${new URLSearchParams(ezShipData).toString()}`;
  res.redirect(redirectUrl);
};
