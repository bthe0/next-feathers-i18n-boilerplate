import React, { Component } from 'react';
import Layout from '../../components/Shared/Layout';
import feathers from '../../lib/feathers';
import { withContext, redirect, extract } from '../../lib/misc';

class Reset extends Component {
    static async getInitialProps({ query }) {
        return {
            token: query.token
        }
    }

    constructor() {
        super();
        this.state = {
            loading: true,
            error: false
        };
    }

    /**
     * Request reset action
     * @param e
     */

    request = async e => {
        e.preventDefault();

        await feathers.service('/api/users').update(null, {
            reset: true,
            ...extract(e.target, ['email'])
        });
    };

    /**
     * Do the reset action
     * @param e
     */

    reset = async e => {
        e.preventDefault();

        const { token } = this.props;

        await feathers.service('/api/users').update(null, {
            reset: true,
            token,
            ...extract(e.target, ['password'])
        });
    };

    /**
     * When error occurs
     * @param error
     * @returns {*}
     * @private
     */

    _renderError = error => {
        return <p>{ error }</p>;
    };

    render() {
        const { token } = this.props;
        const { loading, error } = this.state;

        return (
            <Layout>
                { error && this._renderError(error) }
                {
                    token && (
                        <form onSubmit={this.reset}>
                            <label>New password</label>
                            <input type={'password'} name={'password'} />
                            <br/>
                            <button type={'submit'}>Reset Password</button>
                        </form>
                    )
                }
                {
                    !token && (
                        <form onSubmit={this.request}>
                            <label>Email</label>
                            <input type={'email'} name={'email'} />
                            <br/>
                            <button type={'submit'}>Reset Password</button>
                        </form>
                    )
                }
            </Layout>
        );
    }
}

export default withContext({
    withUser: true,
    redirectAuth(user) {
        if (user) {
            return redirect('panel');
        }
    },
    withLocale: ['misc']
})(Reset);