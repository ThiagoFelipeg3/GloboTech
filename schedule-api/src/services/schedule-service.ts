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
                    championship
                ] = await this.getAttributes(game, referencias)

                /**
                 * Retornar uma lista com jogos dentro de cada campeonato isso vai evitar que
                 * o cliente tenha que sempre organizar as respostas
                 * Campeonato 1 = [jogos,jogos,jogos]
                 * Campeonato 2 = [jogos,jogos,jogos]
                 */

                if (!accumulatorGames[championship.nome]) {
                    accumulatorGames[championship.nome] = [];
                }

                accumulatorGames[championship.nome].push({
                    homeTeam,
                    awayTeam,
                    fase,
                    edition
                })

                return Promise.resolve(accumulatorGames);
            },
            Promise.resolve({})
        );
    }

    private async getAttributes(game: any, referencias: any): Promise<any> {
        const { equipes, fases, edicoes, campeonatos } = referencias;
        const { fase_id, edicao_id } = game;

        const fase = fases[fase_id];
        const edition = edicoes[edicao_id];
        const [ homeTeam, awayTeam ] = await this.getTeams(game, equipes);
        const championship = await this.getChampionship(edition, campeonatos);

        return [
            homeTeam,
            awayTeam,
            fase,
            edition,
            championship
        ];
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
        ])
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
