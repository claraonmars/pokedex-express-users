/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const cookieParser = require('cookie-parser');
const sha256 = require('js-sha256')



// Initialise postgres client
const config = {
    user: 'mac',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
};

if (config.user === 'ck') {
    throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
};

const pool = new pg.Pool(config);

pool.on('error', function(err) {
    console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser())


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

const getRoot = (request, response) => {
    // query database for all pokemon

    // respond with HTML page displaying all pokemon
    const queryString = 'SELECT * from pokemon;';
    pool.query(queryString, (err, result) => {
        if (err) {
            console.error('Query error:', err.stack);
        } else {
            console.log('Query result:', result);

            // redirect to home page
            response.render('pokemon/home', { pokemon: result.rows });
        }
    });
}

const getNew = (request, response) => {
    response.render('pokemon/new');
}

const showPokemon = (request, response) => {
    let id = request.query.id;
    response.redirect('pokemon/' + id);
}

const getPokemon = (request, response) => {
    let id = request.params['id'];
    const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';

    //if req.cookies

    pool.query(queryString, (err, result) => {
        if (err) {
            console.error('Query error:', err.stack);
        } else {
            //console.log('Query result:', result);

            let sqlText = 'SELECT users.id, users.name FROM users INNER JOIN users_pokemons ON (users.id = users_pokemons.user_id) WHERE users_pokemons.pokemon_id =' + id;

            pool.query(sqlText, (err, queryResult) => {
                if (err) {
                    console.log('query error:', err.stack);
                } else {
                    //console.log('query result:', result);
                    console.log(request.cookies['userId']);
                    response.render('pokemon/pokemon', { pokemon: result.rows[0] , user: queryResult.rows, cookies: request.cookies['userId'] });
                }
            });
        }
    });
}

const postPokemon = (request, response) => {
    let params = request.body;

    const queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2);';
    const values = [params.name, params.height];

    pool.query(queryString, values, (err, result) => {
        if (err) {
            console.log('query error:', err.stack);
        } else {
            console.log('query result:', result);

            // redirect to home page
            response.redirect('/');
        }
    });
};

const editPokemonForm = (request, response) => {
    let id = request.params['id'];
    const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
    pool.query(queryString, (err, result) => {
        if (err) {
            console.error('Query error:', err.stack);
        } else {
            console.log('Query result:', result);

            // redirect to home page
            response.render('pokemon/edit', { pokemon: result.rows[0] });
        }
    });
}

const updatePokemon = (request, response) => {
    let id = request.params['id'];
    let pokemon = request.body;
    const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
    const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
    console.log(queryString);
    pool.query(queryString, values, (err, result) => {
        if (err) {
            console.error('Query error:', err.stack);
        } else {
            console.log('Query result:', result);

            // redirect to home page
            response.redirect('/');
        }
    });
}

const deletePokemonForm = (request, response) => {
    response.send("COMPLETE ME");
}

const deletePokemon = (request, response) => {
    response.send("COMPLETE ME");
}
/**
 * ===================================
 * User
 * ===================================
 */


const userNew = (request, response) => {
    let sqlText = 'SELECT id FROM users';

    pool.query(sqlText, (error, queryResults) => {
        if (error) {
            console.log('error!', error);
            res.status(500).send('DIDNT WORKS!!');
        } else {
            response.render('users/new', { users: queryResults.rows })
        }
    });

}

const userCreate = (request, response) => {

    let userId = request.params.id;

    const queryString = 'INSERT INTO users (name, password) VALUES ($1, $2)';

    var hashedPassword = sha256(request.body.password);
    const values = [request.body.name, hashedPassword];

    console.log(queryString);

    pool.query(queryString, values, (err, result) => {

        if (err) {

            console.error('Query error:', err.stack);
            response.send('dang it.');
        } else {

            console.log('Query result:', result);
            let sqlText = 'SELECT * FROM pokemon';

            pool.query(sqlText, (error, queryResults) => {
                if (error) {
                    console.log('error!', error);
                    response.status(500).send('DIDNT WORKS!!');
                } else {
                    response.cookie('loggedin', 'true');
                    response.cookie('userId', userId);
                    response.render('users/catch', { pokemons: queryResults.rows, user: userId })

                }
            });
            // redirect to home page
            //response.redirect('/');
        }
    });
}


const logIn = (request, response) => {
    let sqlText = 'SELECT id FROM users';

    pool.query(sqlText, (error, queryResults) => {
        if (error) {
            console.log('error!', error);
            res.status(500).send('DIDNT WORKS!!');
        } else {
            response.render('users/login', { users: queryResults.rows })
        }
    });

}

const loggedIn = (request, response) => {
    const queryString = 'SELECT * FROM users WHERE name =' + "'" + request.body.name + "'";

    pool.query(queryString, (error, queryResults) => {
        if (error) {
            console.log('error!', error);
            response.status(500).send('DIDNT WORKS!!');
        } else {
            const user = queryResults.rows[0];
            console.log(user);

            var hashedValue = sha256(request.body.password);
            console.log(hashedValue)

            if (user.password === hashedValue) {
                response.cookie('loggedin', 'true');
                response.cookie('userId', user.id);
                response.send('successfully logged in');
            } else {
                response.send('/');
            }
        }
    });


}


const cookiesSuccess = (request, response) => {
    let message = "Welcome to the online Pokedex"
    if (request.cookies['loggedin'] === 'true') {
        message += 'You have logged in successfully'
        //response.render()
    } else {
        message += 'Error, please try logging in again'
    }

    response.send(message);
};

const logout = (request, response) => {
    response.clearCookies('loggedin');
    response.send('Log out successful.')
}


const userId = (request, response) => {

    console.log('request body:', request.body.pokemon_id);
    console.log(request.params.id)
    let userId = request.params.id;
    let pokeId = request.body.pokemon_id;

    //var hashedPassword = sha256(request.body.password);
    //const values = [request.body.name, hashedPassword];

    const queryString = 'INSERT INTO users_pokemons (user_id, pokemon_id) VALUES ($1, $2) RETURNING id';
    let values = [userId, pokeId];


    pool.query(queryString, values, (error, queryResults) => {
        if (error) {
            console.log('error!', error);
            response.status(500).send('DIDNT WORKS!!');
        } else {

            let sqlText = `SELECT pokemon.id, pokemon.name FROM pokemon INNER JOIN users_pokemons ON (pokemon.id = users_pokemons.pokemon_id) WHERE users_pokemons.user_id = ${userId}`

            pool.query(sqlText, (error, result) => {
                if (error) {
                    console.log('error!', error);
                    response.status(500).send('DIDNT WORKS!!');
                } else {
                    console.log(result.rows);
                    response.render('users/items', { pokemons: result.rows, user: userId })
                }
            });
            //response.render('users/items');

        }
    });
};


/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon', showPokemon);

app.get('/pokemon/:id/delete', deletePokemonForm);

app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

// TODO: New routes for creating users

app.get('/users/new', userNew);
app.post('/users/:id/catch', userCreate);
app.post('/user/:id', userId);
app.get('/user/:id', userId);
app.get('/login', logIn);
app.post('/cookies', cookiesSuccess);

app.post('/login/success', loggedIn);


app.get('/cookies', cookiesSuccess);
app.delete('/logout', logout);
/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
    console.log('Recalling all ships to harbour...');
    server.close(() => {
        console.log('... all ships returned...');
        pool.end(() => {
            console.log('... all loot turned in!');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);