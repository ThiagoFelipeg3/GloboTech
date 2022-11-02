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
                    homeTeam,
                    awayTeam,
                    fase,
                    edition,
                    championship,
                    sede
                ] = await this.getAttributes(game, referencias)

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

                const equipes: any = {};
                equipes[game.equipe_mandante_id] = {
                    nome: homeTeam.nome,
                    apelido: homeTeam.apelido,
                    escudos: homeTeam. escudos
                };
                equipes[game.equipe_visitante_id] = {
                    nome: awayTeam.nome,
                    apelido: awayTeam.apelido,
                    escudos: awayTeam. escudos
                };;

                accumulatorGames[championship.nome][fase.nome]['jogos'].push({
                    vencvencedor_jogo: game.vencedor_jogo,
                    rodada: game.rodada,
                    placar,
                    suspenso: game.suspenso,
                    data_hora_realizacao: `${game.data_realizacao} ${game.hora_realizacao}`,
                    nome_sede: sede.nome,
                    equipes
                })

                return Promise.resolve(accumulatorGames);
            },
            Promise.resolve({})
        );
    }

    private async getAttributes(game: any, referencias: any): Promise<any> {
        const { equipes, fases, edicoes, campeonatos, sedes } = referencias;

        const fase = fases[game.fase_id];
        const edition = edicoes[fase.edicao_id];
        const [ homeTeam, awayTeam ] = await this.getTeams(game, equipes);
        const championship = await this.getChampionship(edition, campeonatos);
        const sede = sedes[game.sede_id];

        return [
            homeTeam,
            awayTeam,
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

    private async getTeams(game: any, equipes: any): Promise<any> {
        const { equipe_mandante_id, equipe_visitante_id } = game;

        if (
            equipe_mandante_id in equipes
            && equipe_visitante_id in equipes
        ) {
            return [ equipes[equipe_mandante_id], equipes[equipe_visitante_id] ];
        }

        const homeTeam = this.requester.createRequester('team', equipe_mandante_id);
        const awayTeam = this.requester.createRequester('team', equipe_mandante_id);

        return Promise.all([
            homeTeam?.makeRequest(),
            awayTeam?.makeRequest(),
        ]);
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
