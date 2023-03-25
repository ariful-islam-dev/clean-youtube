import { createStore } from "easy-peasy";
import elapsedModel from "./elapsed-model";
import favoriteModel from "./favorite-model";
import noteModel from "./note-model";
import playlistModel from "./paylist-model";
import recentModel from "./recent-model";
import videoIdModel from "./videoId-model";



const store = createStore({
    playlist: playlistModel,
    favorite: favoriteModel,
    recent: recentModel,
    notes: noteModel,
    videoId: videoIdModel,
    elapsed: elapsedModel,
});

export default store;