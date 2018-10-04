var React = require("react");

class Catch extends React.Component {
  render() {

    let actionURL = '/user/'+this.props.user
    const pokemons = this.props.pokemons.map((pokemon)=>{

        return (<option key={pokemon.id} value={pokemon.id}>{pokemon.name}</option>);

    });

    return (
      <html>
        <head />
        <body>
          <form method="POST" action={actionURL}>
            <div>
              Catch some pokemons!
            </div>
            <select name ='pokemon_id'>{pokemons}</select>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = Catch;
