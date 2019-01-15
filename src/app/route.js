import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import history from './history'

import Painel from './painel';
import ListaComponent from '../produto/ListaComponent';
import CarrinhoComponent from '../carrinho/ListaComponent';
import PedidoComponent from '../pedido/ListaComponent';
import DetalhesComponent from '../pedido/DetalheComponent';

export default class extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/distribuidor" render={() => (
                        <div>
                            <Route path="/distribuidor/:distribuidorId/cliente/:clienteId" component={ListaComponent} exact />
                            <Route path="/distribuidor/:distribuidorId/cliente/:clienteId/carrinho" component={CarrinhoComponent} />
                            <Route path="/distribuidor/:distribuidorId/pedido" component={PedidoComponent} exact/>
                            <Route path="/distribuidor/:distribuidorId/pedido/:id/detalhe" component={DetalhesComponent} />
                        </div>
                    )} />
                    <Redirect exact to='/' component={Painel} />
                </Switch>
            </Router>
        )
    }
}