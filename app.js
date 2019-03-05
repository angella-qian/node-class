let express = require('express');
let knex = require('knex');

let app = express();

// Return array of genres
app.get('/api/genres', function(request, response) {

	let connection = knex({
		client: 'sqlite3',
		connection: {
			filename: 'chinook.db'
		}
	});

	connection.select().from('genres').then( (genres) => {
		response.json(genres);
	});

});

// Return a single genre (placeholder syntax :id in express)
app.get('/api/genres/:id', function(request, response) {

	// Request has access to the url element 'id'
	let id = request.params.id;
	console.log(id);

	let connection = knex({
		client: 'sqlite3',
		connection: {
			filename: 'chinook.db'
		}
	});

	connection
		.select()
		.from('genres')
		.where('GenreId', id)
		.first()
		.then( (genre) => {
			if (genre) {
				response.json(genre);
			} else {
				response.status(404).json({
					error: `Genre ${id} not found`
				});
			}
			
		});
});

// Return array of artists that can be filtered
app.get('/api/artists', function(request, response) {

	// Request has access to the query string 'filter'
	let filter = request.query.filter;	
	console.log(filter);

	let connection = knex({
		client: 'sqlite3',
		connection: {
			filename: 'chinook.db'
		}
	});

	if (filter) {

		connection
		.select()
		.from('artists')
		.where('Name', 'like', `%${filter}%`)
		.then( (artists) => {
			if (artists) {
				let arr = artists.map ( (artist) => {
					let obj = {};
					obj.id = artist.ArtistId;
					obj.name = artist.Name;
					return obj;
				});
				response.json(arr);
			} else {
				response.status(404).json({
					error: `Artist name ${filter} not found`
				});
			}
		});

	} else {

		connection.select().from('artists').then( (artists) => {
			let arr = artists.map( (artist) => {
				let obj = {};
				obj.id = artist.ArtistId;
				obj.name = artist.Name;
				return obj;
			});
			response.json(arr);
		});

	}

});

app.listen(process.env.PORT || 8000);