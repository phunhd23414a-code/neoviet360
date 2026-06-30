const http = require("http");
const app = require("../neoviet360-backend/src/app");

const server = app.listen(0, () => {
  const port = server.address().port;

  http
    .get({ hostname: "127.0.0.1", port, path: "/" }, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        console.log("GET / status", res.statusCode);
        console.log(body);

        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch (error) {
          console.error("Response is not valid JSON");
          server.close(() => process.exit(1));
          return;
        }

        const isValid =
          res.statusCode === 200 &&
          parsed.ok === true &&
          parsed.service === "neoviet360-backend" &&
          parsed.message === "NeoViet360 backend API is running" &&
          Array.isArray(parsed.endpoints) &&
          parsed.endpoints.includes("/api/auth/login");

        server.close(() => process.exit(isValid ? 0 : 1));
      });
    })
    .on("error", (error) => {
      console.error(error);
      server.close(() => process.exit(1));
    });
});