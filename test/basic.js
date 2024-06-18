// Import necessary modules
import { createServer } from "http";
import { Server } from "socket.io";
import ioc from "socket.io-client";
import { assert } from "chai";

// Define a function to wait for a socket event
function waitFor(socket, event) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

// Export your test suite function to be used by Mocha
export function runSocketIOTests() {
  describe("my awesome project", () => {
    let io, serverSocket, clientSocket, httpServer;

    before((done) => {
      httpServer = createServer();
      io = new Server(httpServer);

      httpServer.listen(() => {
        const port = httpServer.address().port; // Get the dynamically assigned port
        clientSocket = ioc(`http://localhost:${port}`);

        io.on("connection", (socket) => {
          serverSocket = socket;
        });

        clientSocket.on("connect", done);
      });
    });

    after(() => {
      io.close();
      clientSocket.disconnect();
      httpServer.close(); // Close the HTTP server after all tests are done
    });

    it("should work", (done) => {
      clientSocket.on("hello", (arg) => {
        assert.equal(arg, "world");
        done();
      });
      serverSocket.emit("hello", "world");
    });

    it("should work with an acknowledgement", (done) => {
      serverSocket.on("hi", (cb) => {
        cb("hola");
      });
      clientSocket.emit("hi", (arg) => {
        assert.equal(arg, "hola");
        done();
      });
    });

    it("should work with emitWithAck()", async () => {
      serverSocket.on("foo", (cb) => {
        cb("bar");
      });
      const result = await new Promise((resolve) => {
        clientSocket.emit("foo", resolve);
      });
      assert.equal(result, "bar");
    });

    it("should work with waitFor()", async () => {
      const promise = waitFor(serverSocket, "baz");
      clientSocket.emit("baz");
      await promise;
    });
  });
}
