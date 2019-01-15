import React from 'react';
import { withRouter } from 'react-router-dom';
import { addCarrinho } from '../app/api';

import { mercado, farmacia } from './produtos';
import MercadoComponent from './MercadoComponent';
import FarmaciaComponent from './FarmaciaComponent';

class ListarComponent extends React.Component {

    constructor(props) {
        super(props)
        this.onMais = this.onMais.bind(this)
        this.onMenos = this.onMenos.bind(this)
        this.onCadastrar = this.onCadastrar.bind(this)
        this.onCarrinho = this.onCarrinho.bind(this)
        this.state = {
            prods: [],
            valorTotal: 0,
            distribuidorId: 0,
            clienteId: 0,
        }
    }

    componentDidMount() {
        const { distribuidorId, clienteId } = this.props.match.params
        
        if (distribuidorId == 1) {
            this.setState({
                prods: mercado,
                clienteId: clienteId,
                distribuidorId: distribuidorId
            })
        }

        if (distribuidorId >= 2) {
            this.setState({
                prods: farmacia,
                clienteId: clienteId,
                distribuidorId: distribuidorId
            })
        }
    }

    onMais (id) {
        let prd = this.state.prods
        let novoPrd = []

        prd.forEach(p => {
            if (p.id === id) {
                p.quantidade += 1
                novoPrd.push(p)
            } else {
                novoPrd.push(p)
            }
        })

        this.setState({ prods: novoPrd })
    }

    onMenos (id) {
        let prd = this.state.prods
        let novoPrd = []

        prd.forEach(p => {
            if (p.id === id && p.quantidade > 1) {
                p.quantidade -= 1
                novoPrd.push(p)
            } else {
                novoPrd.push(p)
            }
        })

        this.setState({ prods: novoPrd })
    }

    onCadastrar(prd) {
        addCarrinho(prd, this.state.distribuidorId, this.state.clienteId).then(() => {
            console.log('pedido realizado')
        })
    }

    onCarrinho() {
        const distribuidorId = this.state.distribuidorId
        const clienteId = this.state.clienteId
        this.props.history.push('/distribuidor/' + distribuidorId + '/cliente/' + clienteId + '/carrinho');
    }

    render() {
        return (
            <div>
                { this.state.distribuidorId == 1 ? (
                    <MercadoComponent
                        {...this.props}
                        {...this.state}
                        onCadastrar={this.onCadastrar}
                        onMais={this.onMais}
                        onMenos={this.onMenos}
                        onCarrinho={this.onCarrinho}
                    />
                ) : (
                    <FarmaciaComponent
                        {...this.props}
                        {...this.state}
                        onCadastrar={this.onCadastrar}
                        onMais={this.onMais}
                        onMenos={this.onMenos}
                        onCarrinho={this.onCarrinho}
                    />
                )}
            </div>
        )
    }
}

export default withRouter(ListarComponent)