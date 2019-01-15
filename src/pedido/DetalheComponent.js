import React from 'react';
import { Image, Button, Container, Header, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

import { getPedidoDetalhe, delPedido } from '../app/api';
import imgAgua from '../img/agua.jpeg';
import imgBanana from '../img/banana.png';
import imgArroz from '../img/arroz.jpg';
import imgSabonete from '../img/sabonete.jpg';
import imgDipirona from '../img/dipirona.jpg';
import imgShampoo from '../img/shampoo.jpg';

class CarrinhoComponent extends React.Component {

    constructor(props) {
        super(props)
        this.onPedido = this.onPedido.bind(this)
        this.onFinalizar = this.onFinalizar.bind(this)
        this.state = {
            produtos: [],
            valorTotal: 0,
            id: '',
            distribuidorId: 0,
        }
    }
    
    componentDidMount() {
        const { distribuidorId, id } = this.props.match.params

        this.setState({ distribuidorId, id })

        getPedidoDetalhe(id).then((pdd) => {
            this.setState({ produtos: pdd.data.produtos })
        }).catch(err => {
            console.log(err)
        })
    }

    onPedido() {
        this.props.history.push('/distribuidor/' + this.state.distribuidorId + '/pedido');
    }

    onFinalizar() {
        delPedido(this.state.id).then(() => {
            this.onPedido()
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <Container>
                <Header as='h2' style={{ padding: 10 }}>
                    <Button circular primary size='medium' floated='left' icon='angle left' onClick={this.onPedido} />
                    Produtos
                </Header>
                {(this.state.produtos || []).map(p => (
                    <List>
                        <List.Item>
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
                <Button fluid positive floated='right' onClick={() => this.onFinalizar()}>Entrega efetuada</Button>
            </Container>
        )
    }
}

export default withRouter(CarrinhoComponent)