import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disable, setDisable] = useState(true);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({credential: 'The provided credentials were invalid'});
        }
      });
  };

  useEffect(() => {
    setErrors({});
    if(credential.length < 4 || password.length < 6) setDisable(true)
    else setDisable(false);
  }, [credential, password]);

  const demoUser = {
    credential: "Demo-lition",
    password: "password",
  };

  return (
    <div id="loginModal">
      <form id="loginForm" onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <div className="fieldOpt">
          <label>
            Username/Email:
          </label>
          <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
        </div>
        <div className="fieldOpt">
          <label>
            Password:
          </label>
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        </div>
        {errors.credential && <p>{errors.credential}</p>}
        <div id='btnDiv' className="fieldOpt">
        <button className="button" disabled={disable} type="submit">Log In</button>
        </div>
        <div className="fieldOpt">
        <a className='button' onClick={() => {
          // e.preventDefault();
          setCredential(demoUser.credential);
          setPassword(demoUser.password);
          dispatch(sessionActions.login(demoUser))
          closeModal()
        }}>
              Log in as Demo User
            </a>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
