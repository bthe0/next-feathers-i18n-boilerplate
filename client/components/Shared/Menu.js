import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';
import Link from '../Misc/Link';
import { Consumer } from '../../pages/context';

export default class Menu extends Component {

    /**
     * Logout action
     * @returns {Promise<void>}
     */

    logout = async () => {
        Cookies.remove('_token');
        Router.pushRoute('/');
    };

    render() {
        return (
            <nav>
                <ul>
                    <li>Hello there</li>
                    <Consumer>
                        {
                            ({ user, i18n }) => (
                                <Fragment>
                                    {
                                        !user && (
                                            <Fragment>
                                                <li>
                                                    <Link route={'register'}>
                                                        <a>
                                                            Register
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link route={'login'}>
                                                        <a>
                                                            Login
                                                        </a>
                                                    </Link>
                                                </li>
                                            </Fragment>
                                        )
                                    }
                                    {
                                        user && (
                                            <li>
                                                <button onClick={this.logout}>Logout</button>
                                            </li>
                                        )
                                    }
                                </Fragment>
                            )
                        }
                    </Consumer>
                </ul>
            </nav>
        );
    }
}