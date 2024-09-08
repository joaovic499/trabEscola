import { PrismaClient, TipoConsulta } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();


export const criarConsulta = async (req: Request, res: Response) => {

    const {tipo, horario, medicoId, pacienteId, dia} = req.body
    const diaDate = new Date(dia);

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
                horario,
                dia: diaDate
            }
        });

        console.log(` ${tipo} marcado com sucesso`, newConsulta)
        res.status(201).json({message: ` ${tipo} marcado com sucesso`, newConsulta})

}   catch (error) {
        console.error("Erro ao criar consulta: ", error);
        res.status(500).send("Erro ao criar o consulta")
    }
}

export const getConsultas = async (req: Request, res: Response) => {
    const {idPaciente} = req.params;

    try{
        if (!idPaciente) {
            return res.status(400).json({message: "Id do paciente obrigatório"});
        }

        const consultas = await prisma.consulta.findMany({
            where: {
                pacienteId: idPaciente 
            },
            select: {
                tipo: true,
                horario: true,
                dia: true,
            }
        });

        res.json(consultas);

    } catch (error) {
        console.log("Erro ao buscar consultas", error)
        res.status(500).send("Erro ao buscas consultas")
    }
}

export const getHorariosIndisponiveis = async (req: Request, res: Response) => {
    const { data } = req.params;

    try {
        if (!data) {
            return res.status(400).json({ message: "Data é obrigatória" });
        }
        const inicioDoDia = new Date(data + 'T00:00:00Z');
        const fimDoDia = new Date(data + 'T23:59:59Z');

        const consultas = await prisma.consulta.findMany({
            where: {
                dia: {
                    gte: inicioDoDia,
                    lte: fimDoDia
                }
            },
            select: {
                horario: true
            }
        });


        const horariosIndisponiveis = consultas.map(consulta => consulta.horario);

        console.log("Horários Indisponíveis: ", horariosIndisponiveis);
        res.json(horariosIndisponiveis);

    } catch (error) {
        console.error("Erro ao obter horários indisponíveis: ", error);
        res.status(500).send("Erro ao obter horários indisponíveis");
    }
}