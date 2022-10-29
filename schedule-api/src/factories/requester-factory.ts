import { Requests } from '../enums/requests';
import { Requester } from '../requesters/requester';
import { ChampionshipRequester } from '../requesters/championship-requester';
import { GamesRequester } from '../requesters/games-requester';
import { TeamRequester } from '../requesters/team-requester';

export class RequesterFactory {
    public createRequester(request: Requests, parameter: string ): Requester|null {
        switch (request) {
            case 'championship':
                return new ChampionshipRequester(parameter);
            case 'game':
                return new GamesRequester(parameter);
            case 'team':
                return new TeamRequester(parameter);
            default:
                return null;
        }
    }
}
