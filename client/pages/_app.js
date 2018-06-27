import App, { Container } from 'next/app';
import React  from 'react';
import Router from 'next/router';
import feathers from '../lib/feathers';
import { parseCookies } from '../lib/misc';
import Cookies from 'js-cookie';

export default class Layout extends App {

    /**
     * Handle middlewares
     * @param Component
     * @param router
     * @param ctx
     * @returns {Promise<{pageProps: {}}>}
     */

    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {
            user: false
        };

        if (Component.withAuth) {
            pageProps.user = await Layout.authenticate({
                ctx,
                redirectAuth: Component.redirectAuth || false
            });
        }

        if (Component.getInitialProps) {
            pageProps = {
                ...pageProps,
                ...await Component.getInitialProps(ctx)
            };
        }

        return {
            pageProps
        };
    }

    /**
     * Function for getting current logged user, else, redirecting to
     * a page or custom redirect if set.
     * @private
     */

    static async authenticate({ ctx, redirectAuth }) {
        const redirect = path => path && ( !!ctx.req ? ctx.res.redirect(path) : Router.pushRoute(path) );
        const _token   = !!ctx.req ? parseCookies(ctx.req.headers.cookie)._token : Cookies.get('_token');

        if (!_token) {
            if (typeof redirectAuth === 'function') {
                return redirectAuth(false, redirect);
            }

            if (typeof redirectAuth === 'string') {
                redirect(redirectAuth);
            }

            return;
        }

        try
        {
            const { user, accessToken } = await feathers.authenticate({
                strategy: 'jwt',
                accessToken: _token
            });

            if (typeof redirectAuth === 'function' && !redirectAuth(user, redirect)) {
                return user;
            }

            return user;
        }
        catch(e)
        {
            if (typeof redirectAuth === 'function') {
                return redirectAuth(false, redirect);
            }

            if (typeof redirectAuth === 'string') {
                redirect(redirectAuth);
            }
        }
    };

    /**
     * Render the page component
     * @returns {*}
     */

    render() {
        const { Component, pageProps } = this.props;

        return (
            <Container>
                <Component {...pageProps}/>
            </Container>
        );
    }
}