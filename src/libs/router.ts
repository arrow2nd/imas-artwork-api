import { Router } from "../deps.ts";
import { artworkController } from "../controllers/artworks_controller.ts";

const router = new Router();

router.get("/", ({ response }) => {
  response.redirect("https://github.com/arrow2nd/imas-artwork-api");
});

router.get("/artwork/:id", (context) => artworkController.get(context));

router.get("/list", artworkController.search);

export { router };
