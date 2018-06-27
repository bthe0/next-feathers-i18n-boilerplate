import React, { Component } from 'react';
import Layout from '../../components/Shared/Layout';
import feathers from '../../lib/feathers';
import { withContext } from '../../lib/misc';

class Verify extends Component {
    static async getInitialProps({ query }) {
        return {
            token: query.token
        }
    }

    constructor() {
        super();
        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        const { token } = this.props;

        const res = await feathers.service('api/users').update(null, {
            verify: true,
            token
        });

        this.setState({
            loading: false
        });
    }

    render() {
        const { loading } = this.state;

        return (
            <Layout>
                { loading && (<p>Loading</p>) }
                { !loading && <p>Account verified</p> }
            </Layout>
        );
    }
}

export default withContext({
    withLocale: ['misc']
})(Verify);