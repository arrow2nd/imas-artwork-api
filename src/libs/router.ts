import { Router } from "../deps.ts";
import { artworkController } from "../controllers/artworks_controller.ts";

const v1 = new Router();

v1.get("/cd/:id", artworkController.get);
v1.get("/list", artworkController.search);

const router = new Router();

router.get("/", artworkController.redirect);
router.get("/v1", v1.routes(), v1.allowedMethods());

export { router };
