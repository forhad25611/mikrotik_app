import type { Express } from "express";
import { createServer, type Server } from "http";
import { RouterOSAPI } from "node-routeros";

export function registerRoutes(app: Express): Server {
  app.post("/api/router/auth", async (req, res) => {
    const { ip, username, password } = req.body;

    try {
      const api = new RouterOSAPI({
        host: ip,
        user: username,
        password: password,
        keepalive: true,
      });

      await api.connect();
      await api.close();

      req.session.routerAuth = {
        ip,
        username,
        password
      };

      res.json({ success: true });
    } catch (error: any) {
      res.status(401).json({ 
        message: "Authentication failed: " + error.message 
      });
    }
  });

  app.get("/api/router/info", async (req, res) => {
    const { ip } = req.query;
    const auth = req.session?.routerAuth;

    if (!ip || typeof ip !== "string") {
      return res.status(400).json({ message: "IP address is required" });
    }

    if (!auth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const api = new RouterOSAPI({
        host: ip,
        user: auth.username,
        password: auth.password,
      });

      await api.connect();

      const [system] = await api.write("/system/resource/print");
      const [identity] = await api.write("/system/identity/print");

      await api.close();

      res.json({
        identity: identity.name,
        version: system.version,
        uptime: system.uptime,
        cpuLoad: system["cpu-load"] + "%",
        memoryUsed: Math.round((system["total-memory"] - system["free-memory"]) / 1024 / 1024) + " MB",
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Failed to fetch router info: " + error.message 
      });
    }
  });

  app.get("/api/router/pppoe-users", async (req, res) => {
    const { ip } = req.query;
    const auth = req.session?.routerAuth;

    if (!ip || typeof ip !== "string") {
      return res.status(400).json({ message: "IP address is required" });
    }

    if (!auth) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const api = new RouterOSAPI({
        host: ip,
        user: auth.username,
        password: auth.password,
      });

      await api.connect();

      const activeUsers = await api.write("/ppp/active/print");
      const usernames = Array.from({ length: 10 }, (_, i) => `ismail${i + 1}`);

      const userStatus = usernames.map(username => {
        const activeUser = activeUsers.find((user: any) => user.name === username);
        return {
          username,
          isOnline: !!activeUser,
          ...(activeUser && {
            uptime: activeUser.uptime,
            address: activeUser.address,
            callerId: activeUser["caller-id"] || null
          })
        };
      });

      await api.close();
      res.json(userStatus);
    } catch (error: any) {
      res.status(500).json({ 
        message: "Failed to fetch PPPoE users: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}