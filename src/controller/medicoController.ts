import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const criarMedico = async (req: Request, res: Response) => {
    
    const { name } = req.body

    try {
        const newMedico = await prisma.doutor.create({
            data: {
                name
            }
        });

        console.log('Médico cadastrado com sucesso', newMedico)
        res.status(201).json({message: 'Médico cadastrado com sucesso', newMedico})

    }   catch(error) {
        console.error("Erro ao criar o médico: ", error);
        res.status(500).send("Erro ao criar a consulta")
    }
}   