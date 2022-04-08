import { Router } from "../deps.ts";
import { artworkController } from "../controllers/artworks_controller.ts";

const router = new Router();

router.get("/", artworkController.redirect);

router.get("/artwork/:id", artworkController.get);

router.get("/list", artworkController.search);

export { router };
