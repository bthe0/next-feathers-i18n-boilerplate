import React, { Component } from 'react';
import Layout from '../../components/Shared/Layout';
import Cookies from 'js-cookie';
import { extract, withContext } from '../../lib/misc';
import feathers from '../../lib/feathers';
import Router from 'next/router';
import Link from '../../components/Misc/Link';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            errors: false
        };
    }

    /**
     * Login action
     * @param e
     * @returns {Promise<void>}
     */

    login = async e => {
        e.preventDefault();

        const input = extract(e.target, ['username', 'password']);

        try
        {
            const { accessToken } = await feathers.authenticate({
                strategy: 'local-username',
                ...input
            });

            Cookies.set('_token', accessToken);
            Router.pushRoute('/panel');
        }
        catch(e)
        {
            input.email = {...input}.username;
            delete input.username;

            try
            {
                const { accessToken } = await feathers.authenticate({
                    strategy: 'local',
                    ...input
                });

                Cookies.set('_token', accessToken);
                Router.pushRoute('/panel');
            }
            catch(e)
            {
                this.setState({ errors: true });
            }
        }
    };

    /**
     * If errors occur
     * @param errors
     * @private
     */

    _renderErrors = errors => {
        return (
            <p>Erorred...</p>
        );
    };

    render() {
        const { errors } = this.state;
        return (
            <Layout>
                <h1>Login</h1>
                { errors && this._renderErrors(errors) }
                <form onSubmit={this.login}>
                    <input type={'text'} name="username" placeholder="Username"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <button type={'submit'}>Login</button>
                </form>
                <Link route={'reset'}>Reset password</Link>
            </Layout>
        );
    }
}

export default withContext({
    withUser: true,
    redirectAuth(user, redirect) {
        if (user) {
            redirect('/');
        }
    }
})(Login);