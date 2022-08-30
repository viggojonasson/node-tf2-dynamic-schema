import axios from 'axios';
import vdf from 'vdf';

export function getItemsGame() {
    return axios({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/scripts/items/items_game.txt',
    }).then(({ data }) => vdf.parse(data)['items_game']);
}
