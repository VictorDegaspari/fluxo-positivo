import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from "../../api";
import "./index.scss";

export default function Login() {
    const navigate = useNavigate();
    const [ error, setError] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const baseUrl = "http://localhost:3001";
    const errors = [
        { minLength: 'Preencha com pelo menos 3 caracteres!'},
        { authError: 'Senha ou Email estão incorretos!' }
    ];

    async function login() {
        if (
            !email || 
            !password || 
            email.length < 3 || 
            password.length < 3
        ) {
            setError(showError('minLength'));
            return;
        }

        try {
            setLoading(true);
            const response = await post(baseUrl + "/auth/session", { email: email, password: password  }, false);
            if (response.info?.type === 'Error') throw new Error();
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.user?._id);
            localStorage.setItem('admin', response.user?.admin);
            localStorage.setItem('email', email);
            setLoading(false);
            navigate('/home');
        } catch (error) {
            localStorage.clear();
            setLoading(false);
            console.error(error);
            setError(showError('authError'));
        }
    }

    function showError (error) {
        let showError = '';
        errors.forEach(element => {
            if (error in element) {
                showError = element[error];
            }
        });
        return showError;
    }

    return (
        <>
            <div id="login" className={'login2 flex min-h-screen items-center justify-end mr-20'} >
                <div className="content m-5 flex flex-col">
                    <a href="https://store-epicgames.com" target='_blank' rel="noreferrer" className="epicLogo cursor-pointer"> </a>
                    <input className=" mb-5" type="email" name="email" id="email" placeholder="E-mail" value={ email } onChange={ (event) => setEmail(event.target.value) }/>
                    <input className="mb-5" type="password" name="password" id="password" placeholder="Senha" value={ password } onChange={ (event) => setPassword(event.target.value) }/>
                    { error && <small className="error" >{ error }</small> }
                    <button id="login-button" className="flex items-center justify-center" 
                            onClick={ () => login() }>
                        <div id="loader-login">
                            { loading && <div className="loader"></div> }
                        </div>
                        Entrar
                    </button>
                </div>
            </div>
        </>
    );
}
