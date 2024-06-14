export default (req, res) => {
  const { query, url } = req;

  console.log('Full request URL:', url); // Log the full request URL

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
