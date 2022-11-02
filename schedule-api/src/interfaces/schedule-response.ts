export interface Phases {
    fase_id: number,
    ordem: number,
    data_inicio: string,
    data_fim: string,
    nome: string,
    nome_edicao?: string,
    edicao_id: number,
    jogos?: Games[]
}

export interface Games  {
    vencedor_jogo: {
        equipe_id: number|null,
        label: string
    },
    rodada: number,
    placar: {
        [key: number]: number
    },
    suspenso: boolean,
    data_hora_realizacao: string,
    nome_sede: string,
    equipes: Teams[]
};

export interface Teams {
    [key: number]: {
        nome: string,
        apelido: string,
        escudos: {
            [key: string]: string
        }
    }
}
