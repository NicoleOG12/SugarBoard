import express from "express";
import multer from "multer";
import path from "path";
import {
  listarDoces,
  buscarDoce,
  criarDoce,
  atualizarDoce,
  deletarDoce,
  listarCategorias
} from "../controllers/docesController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeArquivo = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, nomeArquivo);
  },
});

const upload = multer({ storage });

router.get("/", listarDoces);
router.get("/categorias", listarCategorias);
router.get("/:id", buscarDoce);

router.post("/", upload.single("imagem"), criarDoce);
router.put("/:id", upload.single("imagem"), atualizarDoce);

router.delete("/:id", deletarDoce);

export default router;
