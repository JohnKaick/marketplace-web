import React from 'react';
import { Image, Button, Container, Header, List, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { getCarrinho, delCarrinho, addPedido } from '../app/api';
import imgAgua from '../img/agua.jpeg';
import imgBanana from '../img/banana.png';
import imgArroz from '../img/arroz.jpg';
import imgSabonete from '../img/sabonete.jpg';
import imgDipirona from '../img/dipirona.jpg';
import imgShampoo from '../img/shampoo.jpg';

class CarrinhoComponent extends React.Component {

    constructor(props) {
        super(props)
        this.onRemover = this.onRemover.bind(this)
        this.onGet = this.onGet.bind(this)
        this.onMenu = this.onMenu.bind(this)
        this.onPedido = this.onPedido.bind(this)
        this.state = {
            carrinho: [],
            valorTotal: 0,
            distribuidorId: 0,
            clienteId: 0,
        }
    }
    
    componentDidMount() {
        const { distribuidorId, clienteId } = this.props.match.params

        this.setState({ distribuidorId, clienteId })

        getCarrinho(distribuidorId, clienteId).then((pdd) => {
            let pdds = pdd.data
            let total = 0

            pdds.forEach(p => {
                total += p.valorTotal
            })

            this.setState({ 
                carrinho: pdd.data, 
                valorTotal: total,
            })

        }).catch(err => {
            console.log(err)
        })
    }

    onRemover(id) {
        const { distribuidorId, clienteId } = this.state
        console.log(distribuidorId, clienteId)
        delCarrinho(id, distribuidorId, clienteId).then(() => {
            this.onGet()
        }).catch(err => {
            console.log(err)
        })
    }

    onGet() {
        getCarrinho(this.state.distribuidorId, this.state.clienteId).then((pdd) => {
            let pdds = pdd.data
            let total = 0

            pdds.forEach(p => {
                total += p.valorTotal
            })

            this.setState({ 
                carrinho: pdd.data, 
                valorTotal: total,
            })
        }).catch(err => {
            console.log(err)
        })
    }

    onMenu() {
        this.props.history.push('/distribuidor/' + this.state.distribuidorId + '/cliente/' + this.state.clienteId);
    }

    onPedido() {
        addPedido(this.state.distribuidorId, this.state.clienteId).then(() => {
            this.onMenu()
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <Container>
                <Header as='h2' style={{ padding: 10 }}>
                    <Button primary circular size='medium' floated='left' icon='angle left' onClick={this.onMenu} />
                    Meu carrinho
                </Header>
                {this.state.carrinho.length == 0 ? (
                    <Message info>
                        <Message.Header>Sem produtos no carrinho.</Message.Header>
                    </Message>
                ) : (
                    <div>
                        {(this.state.carrinho || []).map(p => (
                            <List>
                                <List.Item>
                                    <div>
                                        <Button circular basic icon='cancel' color='red' floated='right' onClick={() => this.onRemover(p.id)}/>
                                    </div>
                                    {p.id === 1 && (<Image avatar src={imgAgua} />)}
                                    {p.id === 2 && (<Image avatar src={imgBanana} />)}
                                    {p.id === 3 && (<Image avatar src={imgArroz} />)}
                                    {p.id === 4 && (<Image avatar src={imgSabonete} />)}
                                    {p.id === 5 && (<Image avatar src={imgDipirona} />)}
                                    {p.id === 6 && (<Image avatar src={imgShampoo} />)}
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
                        <Button fluid positive floated='right' onClick={() => this.onPedido()}>Comprar agora</Button>
                    </div>                    
                )}
            </Container>
        )
    }
}

export default withRouter(CarrinhoComponent)