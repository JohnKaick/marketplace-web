import React from 'react';
import { Image, Button, Container, Header, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { getPedidoDetalhe, delPedido } from './api';
import { urlStorage } from './../app/api'

class CarrinhoComponent extends React.Component {

    constructor(props) {
        super(props)
        this.onPedido = this.onPedido.bind(this)
        this.onFinalizar = this.onFinalizar.bind(this)
        this.state = {
            produtos: [],
            valorTotal: null,
            id: null,
            distribuidorId: null,
        }
    }
    
    componentDidMount() {
        const { distribuidorId, id } = this.props.match.params

        this.setState({ distribuidorId, id })

        getPedidoDetalhe(id).then((res) => {
            this.setState({ produtos: res.data.produtos })
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
        const { produtos } = this.state
        return (
            <Container>
                <Header as='h2' style={{ padding: 10 }}>
                    <Button circular primary size='medium' floated='left' icon='angle left' onClick={this.onPedido} />
                    Produtos
                </Header>
                {(produtos || []).map(p => (
                    <List>
                        <List.Item>
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
                <Button fluid positive floated='right' onClick={() => this.onFinalizar()}>Entrega efetuada</Button>
            </Container>
        )
    }
}

export default withRouter(CarrinhoComponent)