import { PrismaClient, Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
var bcrypt   = require('bcryptjs')
import jwt, { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'

const prisma = new PrismaClient();
const secretKey:any = process.env.SECRET_KEY

export const register = async (req: Request, res: Response) => {
    const {email, name, password, role } = req.body;

    try {
        if(!role) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: Role.USER
                }
            });

            console.log('Usuário criado com sucesso', newUser)
            res.status(201).json({message: 'Usuário criado com sucesso', newUser});
        }

        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await prisma.user.create({
                data: {
                    email,
                    name,
                    password,
                    role: Role.ADMIN
                }
            });

        res.status(201).json({message: 'Admin criado com sucesso', newUser});

        }

    } catch (error) {
        console.error("Erro ao criar o usuário: ", error);
        res.status(500).send("Erro ao criar o usuário")
    }
}

export const login = async(req: Request, res: Response) => {
    const {email, password} = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({message: "Erro ao logar"})
        }

        const logar = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!logar){
            return res.status(404).json({message: "Usuário não cadastrado no sistema"})
        }

        const validaSenha = await bcrypt.compare(password, logar.password);

        if(!validaSenha) {
            return res.status(403).json({message: "Senha incorreta"})
        }

        const token = jwt.sign({id: logar.id, role: logar.role}, secretKey, {expiresIn: '1h'});

        if(token) {

            res.json({message: 'Login feito com sucesso', token, logar});

        } else {
            
            res.status(401).json({message: 'Credencias inválidas!'})
        }


    } catch (err){
        console.log(err)
    }
}
