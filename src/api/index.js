import axios from "axios";

const key = import.meta.env.VITE_YOUTUBE_API_KEY;
const base_URL = import.meta.env.VITE_YOUTUBE_BASE_URL;

const getPlaylistItem = async (playlistId, pageToken = "", result = []) => {
  const url = `${base_URL}/playlistItems?part=contentDetails,snippet,status&key=${key}&playlistId=${playlistId}&maxResults=50&pageToken${pageToken}`;

  const { data } = await axios.get(url);
  result = [...result, ...data.items];

  if (data.nextPageToken) {
    result = getPlaylistItem(playlistId, data.nextPageToken, result);
  }
  return result;
};

const getPlaylist = async (playlistId) => {
  const url = `${base_URL}/playlists?part=snippet&id=${playlistId}&key=${key}`;

  const { data } = await axios.get(url);

  const {
    channelId,
    title: playlistTitle,
    description: playlistDescription,
    thumbnails,
    channelTitle,
  } = data?.items[0]?.snippet;

  let playlistItems = await getPlaylistItem(playlistId);
  playlistItems = playlistItems.map((item) => {
    const {
      title,
      description,
      thumbnails: { high },
    } = item.snippet;

    playlistItems;

    return {
      title,
      description,
      thumbnails: high,
      contentDetails: item.contentDetails,
    };
  });

  return {
    playlistId,
    playlistTitle,
    playlistDescription,
    playlistThumbnail: thumbnails.high,
    channelId,
    channelTitle,
    playlistItems,
  }
};

export default getPlaylist;
