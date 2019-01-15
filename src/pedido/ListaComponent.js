import React from 'react';
import { Image, Button, Container, Header, Item, Message, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { getPedido } from '../app/api';
import capaCarrefour from '../img/capa_carrefour.jpg';
import capaDrogaria from '../img/capa_drogaria.jpg';

class PedidoComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            pedidos: [],
            distribuidorId: 0,
        }
    }
    
    componentDidMount() {
        const { distribuidorId } = this.props.match.params

        this.setState({ distribuidorId })

        getPedido(distribuidorId).then((pdd) => {
            this.setState({ pedidos: pdd.data })
        }).catch(err => {
            console.log(err)
        })
    }

    onPedidoDetalhe(id) {
        this.props.history.push('/distribuidor/' + this.state.distribuidorId + '/pedido/' + id + '/detalhe');
    }

    render() {
        return (
            <div>
                { this.state.distribuidorId == 1 ? (
                    <Image src={capaCarrefour} fluid />
                ) : (
                    <Image src={capaDrogaria} fluid />
                )}
                <Container>
                    <Header as='h2' style={{ padding: 10 }}>
                        Pedidos
                    </Header>
                    {this.state.pedidos.length == 0 ? (
                        <Message info>
                            <Message.Header>Sem pedidos solicitados.</Message.Header>
                        </Message>
                    ) : (
                        <Item.Group divided unstackable>
                        {(this.state.pedidos || []).map(p => (
                            <Item>
                                <Item.Content>
                                    <Item.Header as='a'>Cliente Id: {p.clienteId}</Item.Header>
                                    <Item.Meta>Data da solicitação: {new Date(p.createdAt).toLocaleDateString('en-GB')}</Item.Meta>
                                    <Item.Description>
                                        Quantidade de produtos: {p.quantidade}
                                        <br />
                                        Valor total: {p.valorTotal},00
                                    </Item.Description>
                                    <Item.Extra>
                                        <Button primary floated='left' onClick={() => this.onPedidoDetalhe(p._id)}>
                                            <Icon name='list layout' /> Detalhes dos produtos
                                        </Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        ))}
                        </Item.Group>
                    )}
                </Container>
            </div>
        )
    }
}

export default withRouter(PedidoComponent)