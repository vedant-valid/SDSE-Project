import { Router } from "express";
import { chartController } from "../controllers/chartController";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import {
  birthDetailsUpdateSchema,
  chartGenerationSchema,
  guestChartSchema,
} from "../validators/birthChartValidators";

const router = Router();

router.use(authMiddleware);
router.post("/generate", validate(chartGenerationSchema), chartController.generateChart);
router.post("/generate-for", validate(guestChartSchema), chartController.generateForGuest);
router.get("/user", chartController.getChart);
router.get("/user/:userId", chartController.getChart);
router.get("/:chartId", chartController.getChartById);
router.patch("/:chartId", chartController.renameChart);
router.delete("/:chartId", chartController.deleteChart);

export default router;
