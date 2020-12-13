import React from 'react';

function RegisterNow(props) {
  return (
    <small>
      <a className="text-muted text-decoration-none" href="#sign-up">
        Register now
      </a>
    </small>
  );
}

function SignIn(props) {
  return (
    <small>
      <a className="text-muted text-decoration-none" href="#sign-in">
        Sign in instead
      </a>
    </small>
  );
}

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)

    };
    fetch(`/api/auth/${action}`, req)
      .then(res => res.json())
      .then(({ user, token }) => {
        if (user && token) this.props.onSignIn({ user, token });
      });
  }

  render() {
    return (
      <form className="w-100" onSubmit={this.handleSubmit}>
        <div className="mb-3">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          required
          id="username"
          type="text"
          name="username"
          placeholder="braniac"
          onChange={this.handleChange}
          className="form-control bg-light" />
        </div>
        <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          required
          id="password"
          type="password"
          name="password"
          placeholder="********"
          onChange={this.handleChange}
          className="form-control bg-light" />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          { this.props.action === 'sign-in' ? <RegisterNow /> : <SignIn /> }
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    );
  }
}
