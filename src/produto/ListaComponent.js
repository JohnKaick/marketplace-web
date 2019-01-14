import React from 'react';
import { Card, Icon, Image, Button, Container, Header, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'
import { create, getAll, remover } from '../app/api'

import { mercado } from './produtos';
import imgCapa from '../img/capa.jpg';
import imgAgua from '../img/agua.jpeg';
import imgMaca from '../img/maca.jpeg';
import imgSabonete from '../img/sabonete.jpg';

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
            prods: mercado,
            pedido: false,
            carrinho: [],
            valorTotal: 0,
            distribuidorId: '',
            clienteId: '',
        }
    }

    componentDidMount() {
        getAll().then((pdd) => {
            let pdds = pdd.data
            let total = 0

            pdds.forEach(p => {
                total += p.valorTotal
            })

            this.setState({ 
                carrinho: pdd.data, 
                valorTotal: total,
                distribuidorId: this.props.match.params.distribuidorId,
                clienteId: this.props.match.params.clienteId,
            })
        }).catch(err => {
            console.log(err)
        })
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
        create(prd).then(() => {
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
                {this.state.pedido ? (
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
                                    {p.id === 2 && (<Image avatar src={imgMaca} />)}
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
                    <Container>
                        <Image src={imgCapa} fluid />
                        <Header as='h2'>
                            Kiosk da Lu
                            <Button primary floated='right' onClick={this.onPedido}>Meu carrinho</Button>
                        </Header>
                                {this.state.prods.map(p => (
                                    <Card key={p.id}>
                                        <Image src={p.imagem} />
                                        <Card.Content>
                                        <Card.Header>
                                            {p.nome}
                                            <small style={{ padding: 10 }}>R$ {p.valor},00</small>
                                        </Card.Header>
                                        <Card.Description>
                                        <p>Descrição: {p.descricao}</p>                            
                                        <div style={{ marginBottom: 10, float: 'right' }}>
                                            <Button circular color='blue' icon='shopping cart' onClick={() => this.onCadastrar(p)}> 
                                                <Icon name='shopping cart' /> Add 
                                            </Button>
                                        </div>
                                        <Button.Group>
                                            <Button basic color='blue' icon='minus' onClick={() => this.onMenos(p.id)}/>
                                            <Button basic color='blue'>{p.quantidade}</Button>
                                            <Button basic color='blue' icon='plus'onClick={() => this.onMais(p.id)}/>
                                        </Button.Group>
                                    
                                        </Card.Description>
                                        </Card.Content>
                                    </Card>
                                ))}
                    </Container>
                )}
            </div>
        )
    }
}