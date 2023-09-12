
const top_tracks_endpoint = `https://api.spotify.com/v1/me/top/tracks`;

export async function get() {
    const {access_token} = await fetch('http://localhost:3000/api/access_token.json').then(res => res.json())

    const data = await fetch(top_tracks_endpoint, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => res.json());

    return {
        status: 200,
        body: {top_tracks: data.items},
    }
}
