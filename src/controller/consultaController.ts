import { PrismaClient, TipoConsulta } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();


export const criarConsulta = async (req: Request, res: Response) => {

    const {tipo, horario, medicoId, pacienteId} = req.body

    try {
    
        if(!tipo || !medicoId || !pacienteId || !horario) {
            return res.status(400).json({message: "Erro ao logar"})
        }

        if (!Object.values(TipoConsulta).includes(tipo as TipoConsulta)) {
            return res.status(400).json({ message: 'Tipo de consulta inválido'});
        }

        const newConsulta = await prisma.consulta.create({
            data: {
                pacienteId,
                medicoId,
                tipo: tipo as TipoConsulta,
                horario
            }
        });

        console.log(` ${tipo} marcado com sucesso`, newConsulta)
        res.status(201).json({message: ` ${tipo} marcado com sucesso`, newConsulta})

}   catch (error) {
        console.error("Erro ao criar consulta: ", error);
        res.status(500).send("Erro ao criar o consulta")
    }
}