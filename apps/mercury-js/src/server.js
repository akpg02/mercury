const { buildApp } = require("./app");

const port = Number(process.env.PORT || 3000);
const host = "0.0.0.0";

const app = buildApp();

app.listen({ port, host }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`mercury-js running at ${address}`);
});
