const express = require('express')
const axios = require('axios')
const querystring = require('querystring')
const app = express()

const client_id = '553dfbf2f3b748b080b06eb0e0bc8c34'
const client_secret = '9d0ab0357f104661b3d254a808c4db83'

app.get('/', (req, res) => res.send('Hello, Kendra!!'))

app.listen(3300, () => console.log('listening on port 3300'))

app.get('/callback', (req, res) => {
	const auth_code = req.query.code
	axios({
		url: 'https://accounts.spotify.com/api/token',
		method: 'post',
		params: {
			grant_type: 'client_credentials'
		},
		headers: {
			'Accept':'application/json',
        	'Content-Type': 'application/x-www-form-urlencoded'
		},
		auth: {
			username: client_id,
			password: client_secret
		}
	}).then(function(response){
		const access_token = response.data.access_token;
		axios({ url: 'https://api.spotify.com/v1/users/124465854/playlists',  headers: { 'Authorization': 'Bearer ' + access_token }})
			.then(function(response){
				res.send(response.data)
				// res.redirect('/playlists')
			})
			.catch(function(error){
				console.log(error)
			})
	}).catch(function(error){		
	});

})

app.get('/spotify', (req, res) => {
	res.redirect('https://accounts.spotify.com/authorize?' + 
			querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			redirect_uri: 'http://localhost:3300/callback'
		}))
	}
)

app.get('/playlists', (req, res) =>
	res.send('playlists!')
)

