import React, { Component } from "react";
import "whatwg-fetch";
import { getFromStorage, setInStorage } from "../../utils/storage";

const localStorageObjectName = "login_system_storage";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "", // if they have a token, they are signed in
      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpError: ""
    };

    // Bind the functions so React can use them
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(
      this
    );
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(
      this
    );
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(
      this
    );
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(
      this
    );
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(
      this
    );
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(
      this
    );

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * Acquire token stored in local storage.
   * Use token to gather user information from DB.
   */
  componentDidMount() {
    // get the localstorage object
    const obj = getFromStorage(localStorageObjectName);
    if (obj && obj.token) {
      // get token from local storage
      const { token } = obj;

      // verify token
      fetch(`/api/account/verify?token=${token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      // there is no token
      this.setState({
        isLoading: false
      });
    }
  }

  /**
   * Runs when the user clicks the `sign up` button
   * 1. Grab state
   * 2. Post req to backend
   */
  onSignUp() {
    // grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;

    this.setState({
      isLoading: true
    });

    // Post req to backend
    fetch("/api/account/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.mes,
            isLoading: false,
            signUpEmail: "",
            signUpPassword: "",
            signUpFirstName: "",
            signUpLastName: ""
          });
        } else {
          this.setState({
            signUpError: json.mes,
            isLoading: false
          });
        }
      });
  }

  /**
   * 1. Grab state
   * 2. Post req to backend
   */
  onSignIn() {
    // grab state
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true
    });

    // Post req to backend
    fetch("/api/account/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage(localStorageObjectName, { token: json.token });
          this.setState({
            signInError: json.mes,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token
          });
        } else {
          this.setState({
            signInError: json.mes,
            isLoading: false
          });
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true
    });
    // get the localstorage object
    const obj = getFromStorage(localStorageObjectName);
    if (obj && obj.token) {
      // get token from local storage
      const { token } = obj;

      // verify token
      fetch(`/api/account/logout?token=${token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: "",
              isLoading: false
            });
          } else {
            // some error
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      // there is no token
      this.setState({
        isLoading: false,
        token: ""
      });
    }
  }

  /**
   *
   * @param {Where the value of the text box goes} event
   */
  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value
    });
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signUpError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;

    if (isLoading) {
      return <p>We are loading...</p>;
    }

    /**
     * This should probably be broken into multiple components and conglomerated in some
     * container, but what the hell
     */
    if (!token) {
      return (
        <>
          <div>
            {/* If there is an error in the sign in, show it. */}
            {signInError ? <p>{signInError}</p> : null}
            <p>Sign In</p>
            <input
              type="email"
              placeholder="d@gmail.com"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <br />
            <input
              type="password"
              placeholder="password1234"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
          <div>
            {/* If there is an error in the sign in, show it. */}
            {signUpError ? <p>{signUpError}</p> : null}
            <p>Sign Up</p>
            <input
              type="text"
              placeholder="Danny"
              value={signUpFirstName}
              onChange={this.onTextboxChangeSignUpFirstName}
            />
            <br />
            <input
              type="text"
              placeholder="Denenberg"
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
            />
            <br />
            <input
              type="email"
              placeholder="d@gmail.com"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            />
            <br />
            <input
              type="password"
              placeholder="password1234"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            />
            <br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </>
      );
    }

    return (
      <>
        <div>
          <p>Account</p>
          <button onClick={this.logout}>Logout</button>
        </div>
      </>
    );
  }
}

export default Home;
