import express, { Router } from 'express'
import { login, register } from '../auth/authController';
import { criarMedico } from '../controller/medicoController';
import { criarConsulta, getConsultas, getHorariosIndisponiveis } from '../controller/consultaController';
import { authenticateJWT } from '../middleware/auth';
import { authorizeAdmin, authorizeUser } from '../middleware/authorize';

const router = Router();
router.post('/register', register)
router.post('/login', login)

router.post('/register/medico', criarMedico, authenticateJWT, authorizeAdmin)

router.post('/register/consulta', criarConsulta, authenticateJWT, authorizeUser)

router.get('/horarios/:data', getHorariosIndisponiveis)

router.get('/consulta/:idPaciente', getConsultas)

export default router;