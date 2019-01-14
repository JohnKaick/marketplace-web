import React from 'react';
import { Card, Icon, Image, Button, Container, Header, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'
import { addCarrinho, getAll, remover } from '../app/api'

import { mercado, farmacia } from './produtos';
import imgAgua from '../img/agua.jpeg';
import imgBanana from '../img/banana.png';
import imgSabonete from '../img/sabonete.jpg';
import MercadoComponent from './MercadoComponent';
import FarmaciaComponent from './FarmaciaComponent';

export default class extends React.Component {

    constructor(props) {
        super(props)
        this.onMais = this.onMais.bind(this)
        this.onMenos = this.onMenos.bind(this)
        this.onCadastrar = this.onCadastrar.bind(this)
        this.onPedido = this.onPedido.bind(this)
        this.onRemover = this.onRemover.bind(this)
        this.onGet = this.onGet.bind(this)
        this.state = {
            prods: [],
            pedido: false,
            carrinho: [],
            valorTotal: 0,
            distribuidorId: '',
            clienteId: '',
        }
    }

    componentDidMount() {
        let distribuidorId = this.props.match.params.distribuidorId
        let clienteId = this.props.match.params.clienteId

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

    onPedido() {
        if (this.state.pedido) {
            this.setState({ pedido: false })
        } else {
            getAll().then((pdd) => {
                let pdds = pdd.data
                let total = 0
    
                pdds.forEach(p => {
                    total += p.valorTotal
                })
    
                this.setState({ carrinho: pdd.data, valorTotal: total, pedido: true })
            }).catch(err => {
                console.log(err)
            })
        }
    }

    onRemover(id) {
        remover(id).then(() => {
            this.onGet()
        }).catch(err => {
            console.log(err)
        })
    }

    onGet() {
        getAll().then((pdd) => {
            let pdds = pdd.data
            let total = 0

            pdds.forEach(p => {
                total += p.valorTotal
            })

            this.setState({ carrinho: pdd.data, valorTotal: total })
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                { this.state.pedido ? (
                    <Container>
                        <Header as='h2' style={{ padding: 10 }}>
                            <Button primary circular size='medium' floated='left' icon='angle left' onClick={this.onPedido} />
                            Meus pedidos
                        </Header>
                        {(this.state.carrinho || []).map(p => (
                            <List>
                                <List.Item>
                                    <div>
                                        <Button circular basic icon='cancel' color='red' floated='right' onClick={() => this.onRemover(p.id)}/>
                                    </div>
                                    {p.id === 1 && (<Image avatar src={imgAgua} />)}
                                    {p.id === 2 && (<Image avatar src={imgBanana} />)}
                                    {p.id === 3 && (<Image avatar src={imgSabonete} />)}
                                <List.Content>
                                    <List.Header>
                                    {p.nome}
                                    </List.Header>
                                    <List.Description>
                                        <p>
                                            Quantidade: {p.quantidade}
                                            <br />
                                            Valor: R$ {p.valorTotal},00
                                        </p>
                                    </List.Description>
                                </List.Content>
                                </List.Item>
                            </List>
                        ))}
                        <Header as='h3' style={{ padding: 10 }}>
                            Total: R$ {this.state.valorTotal},00
                        </Header>
                    </Container>
                ) : (
                    <div>
                        { this.state.distribuidorId == 1 ? (
                            <MercadoComponent
                            {...this.props}
                            {...this.state}
                                onCadastrar={this.onCadastrar}
                                onMais={this.onMais}
                                onMenos={this.onMenos}
                                onPedido={this.onPedido}
                            />
                        ) : (
                            <FarmaciaComponent
                                {...this.props}
                                {...this.state}
                                onCadastrar={this.onCadastrar}
                                onMais={this.onMais}
                                onMenos={this.onMenos}
                                onPedido={this.onPedido}
                            />
                        )}
                    </div>
                )}
            </div>
        )
    }
}