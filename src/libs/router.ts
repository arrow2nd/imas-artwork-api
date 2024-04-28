import { Hono } from "hono";
import { artworkController } from "../controllers/artworks_controller.ts";

const v1 = new Hono();

v1.get("/cd/:id", artworkController.get);
v1.get("/list", artworkController.search);

const router = new Hono();

router.get("/", artworkController.redirect);
router.route("/v1", v1);

export { router };
