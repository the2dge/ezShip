export default async function handler(req, res) {
  if (req.method === 'POST') {
    const formData = req.body;

    try {
      const ezShipResponse = await fetch('https://map.ezship.com.tw/ezship_map_web.jsp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
      });

      const data = await ezShipResponse.text();
      res.status(200).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching data from ezShip' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
