import React from 'react';
import ListaComponent from './../produto/ListaComponent';
import { Switch } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route path="/distribuidor/:distribuidorId/cliente/:clienteId" component={ListaComponent} exact />
                    </Switch>
                </Router>
            </div>
        )
    }
}