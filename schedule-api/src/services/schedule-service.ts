import { RequesterFactory } from '../factories/requester-factory';
import { Schedule } from '../interfaces/schedule';

export class ScheduleService implements Schedule {
    constructor (private requester: RequesterFactory) {}

    public async games(date: string): Promise<any> {
        const requester = this.requester.createRequester('game', date);
        const response = await requester?.makeRequest();

        return this.formatResponse(response);
    }

    private async formatResponse(response: any) {
        const { resultados: { jogos },  referencias } = response;

        return jogos.reduce(
            async (accGames: any, game: any) => {
                const accumulatorGames = await accGames;
                const [
                    teams,
                    fase,
                    edition,
                    championship,
                    sede
                ] = await this.getFormattedAttributes(game, referencias)

                if (!accumulatorGames[championship.nome]) {
                    accumulatorGames[championship.nome] = {};
                }

                const formatFase = {
                    fase_id: fase.fase_id,
                    ordem: fase.ordem,
                    data_inicio: fase.data_inicio,
                    data_fim: fase.data_fim,
                    nome: fase.nome
                }

                if (!accumulatorGames[championship.nome][fase.nome]) {
                    accumulatorGames[championship.nome][fase.nome] = {
                        ...formatFase,
                        nome: edition.nome,
                        jogos: []
                    };
                }

                const placar: any = {};
                placar[game.equipe_mandante_id] = game.placar_oficial_mandante;
                placar[game.equipe_visitante_id] = game.placar_oficial_visitante;

                accumulatorGames[championship.nome][fase.nome]['jogos'].push({
                    vencvencedor_jogo: game.vencedor_jogo,
                    rodada: game.rodada,
                    placar,
                    suspenso: game.suspenso,
                    data_hora_realizacao: `${game.data_realizacao} ${game.hora_realizacao}`,
                    nome_sede: sede.nome,
                    equipes: teams
                })

                return Promise.resolve(accumulatorGames);
            },
            Promise.resolve({})
        );
    }

    private async getFormattedAttributes(game: any, referencias: any): Promise<any> {
        const { equipes, fases, edicoes, campeonatos, sedes } = referencias;

        const fase = fases[game.fase_id];
        const edition = edicoes[fase.edicao_id];
        const teams = await this.getFormattedTeams(game, equipes);
        const championship = await this.getChampionship(edition, campeonatos);
        const sede = sedes[game.sede_id];

        return [
            teams,
            fase,
            edition,
            championship,
            sede
        ];
    }

    private getPhaseFormat(faseId: number, fases: any) {
        const fase = fases[faseId];
        const {
            fase_id,
            edicao_id,
            ordem,
            data_inicio,
            data_fim,
            nome
        } = fase;

        return {
            fase_id,
            edicao_id,
            ordem,
            data_inicio,
            data_fim,
            nome
        };
    }

    private async getFormattedTeams(game: any, equipes: any): Promise<any> {
        const { equipe_mandante_id, equipe_visitante_id } = game;
        const teamsIds = [equipe_mandante_id, equipe_visitante_id];

        return teamsIds.reduce(async (accTems, teamId) => {
            const accumulatorTeams = await accTems;
            const team = equipes[teamId] || await this.requester.createRequester('team', teamId)?.makeRequest();

            accumulatorTeams[teamId] = {
                nome: team.nome,
                apelido: team.apelido,
                escudos: team. escudos
            };

            return Promise.resolve(accumulatorTeams);
        }, Promise.resolve({}));
    }

    private async getChampionship(edition: any, campeonatos: any): Promise<any> {
        const { campeonato_id } = edition;

        if (campeonato_id in campeonatos) {
            return campeonatos[campeonato_id];
        }

        const championship = this.requester.createRequester('championship', campeonato_id);

        return championship?.makeRequest();
    }
}
