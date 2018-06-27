import React, { Component } from 'react';
import Layout from '../../components/Shared/Layout';
import feathers from '../../lib/feathers';
import { withContext } from '../../lib/misc';

class User extends Component {
    render() {
        const { user } = this.props;

        return (
            <Layout>
                <h1>User</h1>
                <pre>
                    { JSON.stringify(user) }
                </pre>
            </Layout>
        );
    }
}

export default withContext({
    withLocale: ['misc'],
    withUser: true,
    redirectAuth(user, redirect) {
        if (!user) {
            redirect('/login');
        }
    }
})(User);