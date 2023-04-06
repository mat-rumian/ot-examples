// express - here pass your service name
const tracer = require('./tracer')('express-baggage');
const opentelemetry = require('@opentelemetry/api');

// Require in rest of modules
const express = require('express');
const cors = require('cors');
const axios = require('axios').default;

// Setup express
const app = express();
const PORT = 8081;
const HOST = '0.0.0.0'

const getCrudController = () => {
  const router = express.Router();
  const resources = [];
  router.get('/', (req, res) => {
    res.send(resources)});
  router.post('/', (req, res) => {
    resources.push(req.body);
    return res.status(201).send(req.body);
  });
  return router;
};

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("middleware headers")
  console.log(req.headers)
  if (authorization && authorization.includes('secret_token')) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(express.json());
app.use(cors({origin: '*'}))
app.delete('/user', async (req, res) => {
  console.log("Request headers")
  console.log(req.headers)
  // Calls another endpoint of the same API, somewhat mimicing an external API call
  const createdCat = await axios.post(`http://localhost:${PORT}/cats`, {
    name: 'Tom',
    friends: [
      'Jerry',
    ],
  }, {
    headers: {
      Authorization: 'secret_token',
    },
  });
  
  // Get active context
  const ctx = opentelemetry.context.active()
  
  // Get baggage
  const baggage = opentelemetry.propagation.getBaggage(ctx)
  // Display baggage
  console.log("Baggage entries")
  console.log(baggage.getAllEntries())
  
  // Get current span
  const currentSpan = opentelemetry.trace.getSpan(ctx);
  
  // Log baggage entry
  console.log("Baggage username entry")
  console.log(baggage.getEntry("username"))

  // Add attribute to the span with username
  currentSpan.setAttribute("username", baggage.getEntry("username")['value']);

  // Print current span
  console.log("Current span")
  console.log(currentSpan);

  return res.status(200).send(createdCat.data);
});
app.use('/cats', authMiddleware, getCrudController());

app.listen(PORT, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
