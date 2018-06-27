import React, { Component } from 'react';
import { Link as NextLink } from '../../../shared/routes';

const config = require('../../../config/shared.json');

export default class Link extends Component {
    constructor() {
        super();
    }

    render() {
        let { route, params } = this.props;
        let withLocale        = false;
        let language          = '';

        if (typeof window !== 'undefined') {
            let split = window.location.pathname.split('/');

            if (config.languages.indexOf(split[1]) > -1) {
                withLocale = true;
                language   = split[1];
            }
        }

        let props = {
            route: withLocale ? `localized-${route}` : route,
            params: {
                ...params
            }
        };

        if (withLocale) {
            props.params.lang = language;
        }

        return (
            <NextLink {...props}>
                {this.props.children}
            </NextLink>
        );
    }
}