export default function (req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  next()
}
