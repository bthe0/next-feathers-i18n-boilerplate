import { translate, loadNamespaces } from 'react-i18next';
import { getInitialProps, I18n } from '../../shared/i18n';
import { Provider } from '../pages/context';
import React, { Component } from 'react';
import { Router } from '../../shared/routes';
import config from '../../config/shared';

/**
 * Returns a formatted value object
 * @param obj
 * @param fields
 */

export const extract = (obj = {}, fields = []) => {
    const data = {};

    for(const field of fields) {
        if (!obj.hasOwnProperty(field)) {
            continue;
        }

        data[field] = obj[field].checked ? obj[field].checked : obj[field].value;
    }

    return data;
};

/**
 * Helper for parsing cookie header
 */

export const parseCookies = cookie => {
    if (!cookie) {
        return {};
    }

    return cookie.split(';').reduce((previous, current) => {
        let values    = / *([^=]+)=(.*)/.exec(current);
        let key       = values[1];
        previous[key] = decodeURIComponent(values[2]);
        return previous;
    }, {});
};

/**
 * Higher order component for authentication
 * @param Component
 * @param redirectAuth
 */

export const withUser = (Component, redirectAuth) => {
    Component.withAuth = true;
    Component.redirectAuth = typeof redirectAuth !== 'undefined' ? redirectAuth : '/auth/login';
    return Component;
};

/**
 * Higher order component for localization
 * @param namespaces
 * @returns {function(*=)}
 */

export const withI18next = (namespaces = ['common']) => Component => {
    const Extended = translate(namespaces, { i18n: I18n, wait: process.browser })(Component);

    Extended.getInitialProps = async (ctx) => {
        const composedInitialProps = Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {};

        const i18nInitialProps = ctx.req
            ? getInitialProps(ctx.req, namespaces)
            : await loadNamespaces({
                components: [{ props: { namespaces } }],
                i18n: I18n,
            });

        return {
            ...composedInitialProps,
            ...i18nInitialProps
        }
    };

    return Extended
};

/**
 * Higher order component for context
 * @param opts
 * @returns {function(*)}
 */

export const withContext = (opts = {}) => WrappedComponent => {
    let NewComponent = class extends Component {
        static async getInitialProps(initialProps) {
            const { getInitialProps } = WrappedComponent;

            let pageProps = {};

            if (getInitialProps) {
                pageProps = {
                    ...await getInitialProps(initialProps)
                }
            }

            return pageProps;
        }

        render() {
            return (
                <Provider value={this.props}>
                    <WrappedComponent {...this.props}/>
                </Provider>
            );
        }
    };

    if (opts.withUser) {
        NewComponent = withUser(NewComponent, opts.redirectAuth);
    }

    NewComponent = withI18next(opts.withLocale || [])(NewComponent);

    return NewComponent;
};

/**
 * Function for handling localized redirect
 * @param name
 * @param params
 */

export const redirect = (name, params) => {
    let withLocale = false;
    let language   = '';

    if (typeof window !== 'undefined') {
        let split = window.location.pathname.split('/');

        if (config.languages.indexOf(split[1]) > -1) {
            withLocale = true;
            language   = split[1];
        }
    }

    let route = withLocale ? `localized-${name}` : name;
    let opts  = withLocale ? { lang: language, ...params } : params;

    Router.pushRoute(route, opts);
};