import React, { Component } from 'react';
import Layout from '../../components/Shared/Layout';
import feathers from '../../lib/feathers';
import { extract, withContext } from '../../lib/misc';
import Cookies from 'js-cookie';
import { redirect } from '../../lib/misc';
import _ from 'lodash';

/**
 * Register page
 */

class Register extends Component {
    constructor() {
        super();

        this.state = {
            errors: false
        };
    }

    /**
     * Register action
     * @param e
     * @returns {Promise<void>}
     */

    register = async e => {
        e.preventDefault();
        const { i18n } = this.props;

        try
        {
            const payload  = extract(e.target, ['name', 'username', 'email', 'password']);
            payload.locale = i18n.language;

            await feathers.service('/api/users').create(payload);

            const { accessToken } = await feathers.authenticate({
                strategy: 'local-username',
                ..._.pick(payload, ['username', 'password'])
            });

            Cookies.set('_token', accessToken);
            redirect('panel');
        }
        catch(e)
        {
            this.setState({ errors: e.errors });
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
                <h1>Register</h1>
                { errors && this._renderErrors(errors) }
                <form onSubmit={this.register} method={'POST'}>
                    <label>Name:</label>
                    <input type={'text'} name={'name'} />
                    <br/>
                    <label>Username:</label>
                    <input type={'text'} name={'username'} />
                    <br/>
                    <label>Email:</label>
                    <input type={'email'} name={'email'} />
                    <br/>
                    <label>Password:</label>
                    <input type={'password'} name={'password'} />
                    <br/>
                    <button type={'submit'}>Register</button>
                </form>
            </Layout>
        );
    }
}

export default withContext({
    withUser: true,
    withLocale: ['misc'],
    redirectAuth(user, redirect) {
        if (user) {
            redirect('/panel');
        }
    }
})(Register);