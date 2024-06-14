export default (req, res) => {
  const { query } = req;
  const ezShipData = {
    stName: query.stName,
    stAddr: query.stAddr,
    stCate: query.stCate,
    stCode: query.stCode,
  };

  const redirectUrl = `https://your-project-name.vercel.app/index.html?${new URLSearchParams(ezShipData).toString()}`;
  res.redirect(redirectUrl);
};
