import { Router } from "express";


const router = Router();

router.get('/', (req, res) => {
  res.send("you are in a route");
})

export default router;