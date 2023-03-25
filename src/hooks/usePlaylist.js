import { useEffect, useState } from "react";
import storage from "../utils/Storage";



const STORAGE_KEY = 'cy_playlist_state';
const initialState = {
    playlists:{},
    recent:[],
    favorite:[]
}
const usePlaylist = () => {
   const [state, setState]=useState(initialState);
   const [error, setError]=useState("");
   const [loading, setLoading]=useState<boolean>(false);

   useEffect(()=>{
    const state = storage.get(STORAGE_KEY);

    if(state){
        setState({...state})
    }
   }, []);

   useEffect(()=>{
    if(state !== initialState){
        storage.save(STORAGE_KEY, state)
    }
   }, [state]);

   const getPlaylistById = async(playlistId, force=false)=>{
    if(state.playlists[playlistId] && !force){
        console.log(playlistId);
        return;
    }
    setLoading(true)

    try{
        const playlist = await getPlaylist(playlistId);
        console.log(playlist);
        setError("");
        setState(prev=>({...prev, playlists:{...prev.playlists, [playlistId]: playlist}}))

    }catch(e){
        setError(e.response?.data?.error?.message|| "Something Wen Wrong")
    }
    finally{
        setLoading(false)
    }
   };

   const addToFavorite = (playlistId)=>{
    setState(prev=>({
        ...prev, 
        favorite: [...prev, playlistId]
    }))
   };

   const addToRecent = (playlistId)=>{
    setState(prev=>({
        ...prev, 
        recent: [...prev, playlistId]
    }))
   };

   const getPlaylistByIds= (ids=[])=>{
    return ids.map(id=>state.playlists[id]);
   }

   return {
    playlists: state.playlists,
    favorite: getPlaylistByIds(state.favorite),
    recent: getPlaylistByIds(state.recent),
    getPlaylistById,
    addToFavorite,
    addToRecent,
    error,
    loading
   }

};

export default usePlaylist;