var React = require("react");

class New extends React.Component {
  render() {
    let numOfUsers = this.props.users.length
    let idNum = numOfUsers + 1

    //let actionURL='/user/'+idNum
    let actionURL='/users/' + idNum +'/catch'
    return (
      <html>
        <head />
        <body>
          <form method="POST" action={actionURL}>
            <div>
              name:<input name="name" type="text" />
              password:<input name="password" type="text" />

            </div>
            <input type="submit" value="sign up" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = New;
