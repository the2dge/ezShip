export default (req, res) => {
  const { query } = req;
  const ezShipData = {
    stName: query.stName,
    stAddr: query.stAddr,
    stCate: query.stCate,
    stCode: query.stCode,
  };

  const redirectUrl = `https://ez-ship.vercel.app/index.html?${new URLSearchParams(ezShipData).toString()}`;
  res.redirect(redirectUrl);
};
