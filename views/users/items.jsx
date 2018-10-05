var React = require("react");

class Item extends React.Component {
  render() {
    let user=this.props.user
    let actionURL

    const caughtPokemon = this.props.pokemons.map((pokemon)=>{
        actionURL= '/pokemon'
        return (<option key={pokemon.id} value={pokemon.id}>{pokemon.name}</option>);

    });

    return (
      <html>
        <head />
        <body>
            <div>
              Hello! {user}
            </div>
            <div>
            Your Pokemons:

            <form method ='GET' action={actionURL}>
            <select name="id">{caughtPokemon}</select>
            <input type='submit' value='more info'/>
            </form>
            </div>

        </body>
      </html>
    );
  }
}

module.exports = Item;
