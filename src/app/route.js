import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Painel from '../components/painel';
import CompraComponent from '../produto/CompraComponent';
import CarrinhoComponent from '../carrinho/ListaComponent';
import PedidoComponent from '../pedido/ListaComponent';
import DetalhesComponent from '../pedido/DetalheComponent';
import NavBar from '../components/NavBar';
import ClienteComponent from '../cliente/ListaComponent';
import DistribuidorComponent from '../distribuidor/ListaComponent';
import DistribuidorCadastroComponent from '../distribuidor/CadastroComponent';
import EstoqueComponent from '../produto/EstoqueComponent';
import CategoriaComponent from '../categoria/ListaComponent';
import ClienteCadastroComponent from '../cliente/CadastroComponent';
import LoginDistribuidorComponent from '../conta/LoginDistribuidorComponent';
import CadastroClienteComponent from '../pedido/CadastroClienteComponent';
import DetalheClienteComponent from '../pedido/DetalheClienteComponent';
import DistribuidorCadastroClienteComponent from '../distribuidor/CadastroClienteComponent';


export default class extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/distribuidor" render={() => (
                        <div>
                            <Route path="/distribuidor" component={LoginDistribuidorComponent} exact />
                            <Route path="/distribuidor/:distribuidorId/cliente/:clienteId" component={CompraComponent} exact />
                            <Route path="/distribuidor/:distribuidorId/cliente/:clienteId/carrinho" component={CarrinhoComponent} />
                            <Route path="/distribuidor/:distribuidorId/pedido" component={PedidoComponent} exact/>
                            <Route path="/distribuidor/:distribuidorId/pedido/:id/detalhe" component={DetalhesComponent} />
                            <Route path="/distribuidor/:distribuidorId/cadastrar/cliente" component={CadastroClienteComponent} exact />
                            <Route path="/distribuidor/:distribuidorId/editar/cliente/:clienteId" component={CadastroClienteComponent} />
                            <Route path="/distribuidor/:distribuidorId/detalhe/cliente/:clienteId" component={DetalheClienteComponent} />
                        </div>
                    )} />
                    <Route path="/admin" render={() => (
                        <div>
                            <NavBar />
                            <Route path="/admin" component={ClienteComponent} exact />
                            <Route path="/admin/cliente/cadastrar" component={ClienteCadastroComponent} exact/>
                            <Route path="/admin/cliente/:clienteId/editar" component={ClienteCadastroComponent} exact/>
                            <Route path="/admin/distribuidor" component={DistribuidorComponent} exact />
                            <Route path="/admin/distribuidor/cadastrar" component={DistribuidorCadastroComponent} exact/>
                            <Route path="/admin/distribuidor/:distribuidorId/editar" component={DistribuidorCadastroComponent} />
                            <Route path="/admin/distribuidor/:distribuidorId/cliente/cadastrar" component={DistribuidorCadastroClienteComponent} />
                            <Route path="/admin/distribuidor/:distribuidorId/cliente/:clienteId/editar" component={DistribuidorCadastroClienteComponent} />
                            <Route path="/admin/produto" component={EstoqueComponent} exact />
                            <Route path="/admin/categoria" component={CategoriaComponent} exact />
                        </div>
                    )} />
                    <Redirect exact to='/' component={Painel} />
                </Switch>
            </Router>
        )
    }
}