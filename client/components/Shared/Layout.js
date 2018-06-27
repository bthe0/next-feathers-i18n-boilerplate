import React, { Component, Fragment } from 'react';
import Menu from './Menu';

export default class Layout extends Component {
    render() {
        const { menu = true } = this.props;

        return (
            <Fragment>
                { menu && <Menu/> }
                { this.props.children }
            </Fragment>
        );
    }
}