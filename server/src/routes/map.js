import { Hono } from "hono";
import { authRequired } from "../lib/auth.js";
import { listStations } from "../core/map.js";

const map = new Hono();

map.use("*", authRequired);

map.get("/stations", (c) => {
  return c.json({ stations: listStations() });
});

export default map;
