import React from 'react';
import { Image, Button, Container, Header, List, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { getCarrinho, delCarrinho } from './api';
import { addPedido } from '../pedido/api'
import { urlStorage } from './../app/api'
import ModalFinalizarComponent from './ModalFinalizarComponent'

class CarrinhoComponent extends React.Component {

    state = {
        carrinho: [],
        valorTotal: 0,
        distribuidorId: null,
        clienteId: null,
    }

    componentDidMount() {
        this.get()
    }

    get = () => {
        const { distribuidorId, clienteId } = this.props.match.params
        getCarrinho(distribuidorId, clienteId).then(res => {
            let pdds = res.data
            let total = 0

            pdds.forEach(p => {
                total += p.valorTotal
            })

            this.setState({ 
                carrinho: res.data, 
                valorTotal: total,
                distribuidorId,
                clienteId
            })
        }).catch(err => {
            console.log(err)
        })
    }

    onRemover = (produtoId) => {
        const { distribuidorId, clienteId } = this.state        
        delCarrinho(produtoId, distribuidorId, clienteId).then(() => {
            this.get()
        }).catch(err => {
            console.log(err)
        })
    }
    
    onMenu = () => {
        const { distribuidorId, clienteId } = this.state 
        this.props.history.push('/distribuidor/' + distribuidorId + '/cliente/' + clienteId);
    }

    onPedido = () => {
        const { distribuidorId, clienteId } = this.state
        addPedido(distribuidorId, clienteId).then(() => {
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
                                        <Button circular basic icon='cancel' color='red' floated='right' onClick={() => this.onRemover(p.produtoId)}/>
                                    </div>
                                    <Image avatar src={p.imagemPath ? `${urlStorage}/${p.imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} />
                                <List.Content>
                                    <List.Header>
                                        {p.nome}                               
                                    </List.Header>
                                    <List.Description>
                                        <p>
                                            Quantidade: {p.quantidade}
                                            <br />
                                            Valor: R$ {p.valorTotal}
                                            <br />
                                            {p.observacao && (
                                                <div>
                                                    OBS: {p.observacao}
                                                </div>
                                            )}
                                        </p>
                                    </List.Description>                                    
                                </List.Content>
                                </List.Item>
                            </List>
                        ))}
                        <Header as='h3' style={{ padding: 10 }}>
                            Total: R$ {this.state.valorTotal}
                        </Header>
                        <ModalFinalizarComponent onPedido={this.onPedido}>
                            <Button fluid positive floated='right' >Pedir agora</Button>
                        </ModalFinalizarComponent>
                    </div>                    
                )}
            </Container>
        )
    }
}

export default withRouter(CarrinhoComponent)