const http = require("http");
const app = require("../neoviet360-backend/src/app");

const server = app.listen(0, () => {
  const port = server.address().port;

  const req = http.request(
    {
      hostname: "127.0.0.1",
      port,
      path: "/api/auth/login",
      method: "OPTIONS",
      headers: {
        Origin: "http://127.0.0.1:5500",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    },
    (res) => {
      const allowOrigin = res.headers["access-control-allow-origin"];
      const isValid =
        res.statusCode === 204 &&
        allowOrigin === "http://127.0.0.1:5500";

      console.log("OPTIONS /api/auth/login status", res.statusCode);
      console.log("access-control-allow-origin", allowOrigin);

      server.close(() => process.exit(isValid ? 0 : 1));
    }
  );

  req.on("error", (error) => {
    console.error(error);
    server.close(() => process.exit(1));
  });

  req.end();
});