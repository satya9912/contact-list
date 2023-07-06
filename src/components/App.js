import React from "react";
import ListItem from "./ListItem";
import AddContacts from "./AddContacts";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      loading: true
    };
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => {
        this.setState({
          users: data,
          loading: false
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          loading: false
        });
      });
  }

  handleDeleteContact = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(() => {
        let { users } = this.state;
        let updatedUsers = users.filter((user) => user.id !== id);
        this.setState({
          users: updatedUsers
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleUpdateContact = (name, phone, id) => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone
      })
    })
      .then(response => response.json())
      .then(data => {
        const { users } = this.state;
        let updatedUsers = users.map((user) => {
          if (user.id === id) {
            user.name = data.name;
            user.phone = data.phone;
          }
          return user;
        });
        this.setState({
          users: updatedUsers
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleAddContact = (name, phone) => {
    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone
      })
    })
      .then(response => response.json())
      .then(data => {
        let id = data.id;
        const { users } = this.state;
        let updatedUsers = [{ name, phone, id }].concat(users);
        this.setState({
          users: updatedUsers
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { users, loading } = this.state;
    return (
      <div className="App">
        <AddContacts addContact={this.handleAddContact} />
        <div id="contact-list-container">
          <header>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1250/1250592.png"
              alt="contact-icon"
            ></img>
            <h1>My Contacts List</h1>
          </header>
          <ul>
            {loading ? (
              <h1>Loading....</h1>
            ) : (
              users.map((user) => {
                return (
                  <ListItem
                    name={user.name}
                    contact={user.phone}
                    key={user.id}
                    id={user.id}
                    handleDelete={this.handleDeleteContact}
                    handleUpdate={this.handleUpdateContact}
                  />
                );
              })
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

