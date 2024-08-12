import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { AddVideosToPlaylist, CreatePlaylist, DeletePlaylist, GetUserPlaylist, RemoveVideofromPlaylist, UpdatePlaylist } from "../controllers/Playlist.controller.js";

const router=Router()

router.route("/createplaylist").post(verifyJWT,CreatePlaylist)

router.route("/:playlistid/:videoid").put(verifyJWT,AddVideosToPlaylist)

router.route("/myplaylist").get(verifyJWT,GetUserPlaylist)

router.route("/:playlistid/removevideo").delete(verifyJWT,RemoveVideofromPlaylist)

router.route("/:playlistid/delete").delete(verifyJWT,DeletePlaylist)

router.route("/:playlistid/update").patch(verifyJWT,UpdatePlaylist)

export default router;