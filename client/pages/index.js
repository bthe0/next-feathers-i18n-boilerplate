import React, { Component } from 'react';
import Layout from '../components/Shared/Layout';
import { Trans } from 'react-i18next';
import { withContext } from '../lib/misc';

import '../styles/index.scss';

class Index extends Component {
    render() {
        return (
            <Layout>
                <h1>Index Page</h1>
                <Trans i18nKey='hello' />
            </Layout>
        );
    }
}

export default withContext({
    withLocale: ['misc'],
    withUser: true,
    redirectAuth: false
})(Index);