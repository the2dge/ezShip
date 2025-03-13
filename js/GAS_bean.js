function generateECPayLogisticsForm(orderId) {
  const gatewayUrl = "https://logistics.ecpay.com.tw/Express/map";
  const hashKey = '1LB3xdWvpCfBUcvm';  // MR.BEAN Hash Key
  const hashIv = 'nLw4YqFOCAD9dfiP';

  const formArray = {
    MerchantID: "3428230",
    MerchantTradeNo: orderId,
    LogisticsType: "CVS",
    LogisticsSubType: "UNIMARTC2C",
    IsCollection: "N",
    ServerReplyURL: "https://ecpay-c2c-return-returnpage-782669854704.asia-east1.run.app",
    ExtraData: '',
    Device: 1
  };

  // Calculate CheckMacValue
  formArray['CheckMacValue'] = getMacValue(hashKey, hashIv, formArray);

  return {
    gatewayUrl: gatewayUrl,
    formData: formArray
  };
}