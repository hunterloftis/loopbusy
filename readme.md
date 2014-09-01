# Loopbusy

Middleware to send 503s and keep your server alive when it's too busy to queue more requests.

```js
var app = express();

app
  .use(loopbusy())
  .get('/', function sendOk(req, res, next) {
    res.send('ok');
  })
  .use(function handleErrors(err, req, res, next) {
    res.status(err.status).send('err');
  });
```

Loopbusy uses the [event-loop-lag](https://github.com/pebble/event-loop-lag)
module to determine when the event loop is piling up requests.

When lag passes a threshold, loopbusy passes 503 errors
to your middleware stack so your app can stay alive for some users
instead of falling over for all users.

## Options

### Max Lag

```js
loopbusy(500);
```

The maximum lag (in ms) of your event loop.

Defaults to 250.

### Interval

```js
loopbusy(null, 3000);
```

The polling interval (in ms) for measuring your event loop.
Shorter values catch business faster at the cost of
additional overhead.

Defaults to 1000.

## Tests

```js
npm test
```
