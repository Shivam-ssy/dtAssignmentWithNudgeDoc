import { createEvent, deleteEvent, getEventByQuery, updateEvent } from "../controllers/Event.Contoller.js";
import { Router } from "express";
import upload from "../middleware/MulterCloudinary.middleware.js";

const router=Router()

router.route('/events').post(upload.array('files',5),createEvent)
router.route('/events/:id').put(upload.array('files',5),updateEvent)
router.route('/events/:id').delete(deleteEvent)
router.route('/events').get(getEventByQuery)

export default router