const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;
const redirect_uri = "http://localhost:3000/";
const token_endpoint = `https://accounts.spotify.com/api/token`;

export const get = async () => {
    const { access_token } = await fetch(token_endpoint, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
            redirect_uri,
            client_id,
            client_secret,
        })
    }).then(res => res.json());

    return {
        body: access_token
    }
};