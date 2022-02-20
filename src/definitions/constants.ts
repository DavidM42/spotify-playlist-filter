export const appName = 'Playlist Filter App';

// replaced by rollup bundler with client id out of env variables
export const client_id = 'SPOTIFY_CLIENT_ID';

export const scopes = [
    'user-read-playback-state',
    'streaming',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-email',
    'playlist-modify-private',
    'playlist-modify-public'
];