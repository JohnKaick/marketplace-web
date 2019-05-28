import React from 'react';

import { NavLink } from 'react-router-dom'

import { Container, Menu } from 'semantic-ui-react';

class Header extends React.Component {

    render() {
        return (
            <Menu pointing secondary >
                <Container>
                    <Menu.Item as={NavLink} to="/admin" content='Cliente' />
                    <Menu.Item as={NavLink} to="/admin/distribuidor" content='Distribuidor' />
                    <Menu.Item as={NavLink} to="/admin/produto" content='Produto' />
                    <Menu.Item as={NavLink} to="/admin/categoria" content='Categoria' />
                </Container>
            </Menu>
        )
    }
}

export default Header;