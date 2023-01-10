import express from "express";
import {
  createNewNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../controllers/noteControllers.js";

const router = express.Router();

router
  .route("/")
  .get(getNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

export default router;
