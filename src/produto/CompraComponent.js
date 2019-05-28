import React from 'react';
import { withRouter } from 'react-router-dom';
import { Item, Icon, Image, Button, Container, Header, Dropdown } from 'semantic-ui-react';
import { getKeep } from '../app/api';
import { getDistribuidor } from './api';
import { urlStorage } from '../app/api'
import ModalConfirmaComponent from './ModalConfirmaComponent'

class ListarComponent extends React.Component {

    state = {
        distribuidorId: null,
        clienteId: null,
        produtos: [],
        grupos: [],
        nome: '',
        capa: null,
        online: true,
    }

    componentDidMount() {
        const { distribuidorId, clienteId } = this.props.match.params

        getDistribuidor(distribuidorId).then(res => {
            const distribuidor = res.data.distribuidor
            console.log('grupos', res.data.grupos)
            this.setState({
                produtos: res.data.produtos,
                grupos: res.data.grupos,
                nome: distribuidor.nome,
                capa: distribuidor.imagemPath ? `${urlStorage}/${distribuidor.imagemPath}` : null,
                distribuidorId,
                clienteId,
            })
            return getKeep(distribuidorId)
        }).then(pdd => {
            let pdds = pdd.data
            let time2 = pdds.time
            let currentTime = (new Date).getTime();
            let dif = currentTime - time2
            let teste = 0

            if (dif<8000){
                teste = 1
                //this.state = {teste: true};
                this.setState({ online: true })
            } else {
                teste = 0
                //this.state = {teste: false};
                this.setState({ online: true })
            }

        }).catch(err => {
            console.log(err)
        })
    }

    onGrupoSelected = (e, { value }) => {
        const { grupos } = this.state
        
        grupos.forEach(g => {
            if (g.categoria === value) {
                this.setState({ produtos: g.produtos })
            }
        })
    }

    onMais = (id) => {
        let prd = this.state.produtos
        let novoPrd = []

        prd.forEach(p => {
            if (p._id === id) {
                p.quantidade += 1
                novoPrd.push(p)
            } else {
                novoPrd.push(p)
            }
        })

        this.setState({ produtos: novoPrd })
    }

    onMenos = (id) => {
        let prd = this.state.produtos
        let novoPrd = []

        prd.forEach(p => {
            if (p._id === id && p.quantidade > 1) {
                p.quantidade -= 1
                novoPrd.push(p)
            } else {
                novoPrd.push(p)
            }
        })

        this.setState({ produtos: novoPrd })
    }

    onKeep = () => {
        getKeep(this.state.distribuidorId).then((pdd) => {
            let pdds = pdd.data
            console.log('time =')
        }).catch(err => {
            console.log(err)
        })
    }

    onCarrinho = () => {
        const { distribuidorId, clienteId } = this.state
        this.props.history.push('/distribuidor/' + distribuidorId + '/cliente/' + clienteId + '/carrinho');
    }

    onQtsDefault = () => {
        let prd = this.state.produtos
        let novoPrd = []
        prd.forEach(p => {
            p.quantidade = 1
            novoPrd.push(p)
        })
        this.setState({ produtos: novoPrd })
    }

    render() {
        const { online, produtos, capa, nome, distribuidorId, clienteId, grupos } = this.state
        return (
            <Container>
                <Header as='h2' style={{ marginTop: 20 }}>
                    {nome}
                    <Button primary floated='right' onClick={() => this.onCarrinho()}>
                        <Icon name='shopping cart' /> Meu carrinho
                    </Button>
                </Header>
                <Image src={capa} fluid />
                <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <small style={{ fontSize: 20 }}>Produtos:</small>
                    <Dropdown
                        button
                        style={{ float: 'right' }}
                        placeholder='Todos'
                        selection
                        options={grupos.map((g, i) => {
                            return { key: g.categoria, text: g.categoria, value: g.categoria }
                        })}
                        onChange={this.onGrupoSelected}
                    />
                </div>
                <Item.Group divided unstackable>
                    {(produtos || []).map(p => (
                        <Item>
                            <Item.Content>
                            <Item.Image size='tiny' src={p.imagemPath ? `${urlStorage}/${p.imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} />
                                <Item.Header style={{ padding: 10 }}>
                                    {p.nome}
                                    <br />
                                    <small>R$ {p.valor}</small>
                                </Item.Header>
                                <Item.Description>
                                    <p>{p.descricao}</p>   
                                </Item.Description>
                                <Item.Extra>
                                    <div style={{ marginBottom: 10, float: 'right' }}>
                                        <ModalConfirmaComponent onQtsDefault={this.onQtsDefault} onCarrinho={this.onCarrinho} produto={p} distribuidorId={distribuidorId} clienteId={clienteId}>
                                            <Button circular color='blue' icon='shopping cart'> 
                                                <Icon name='shopping cart' /> Add 
                                            </Button>
                                        </ModalConfirmaComponent>
                                    </div>
                                    <Button.Group>
                                        <Button basic color='blue' icon='minus' onClick={() => this.onMenos(p._id)}/>
                                        <Button basic color='blue'>{p.quantidade}</Button>
                                        <Button basic color='blue' icon='plus'onClick={() => this.onMais(p._id)}/>
                                    </Button.Group>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))}
                </Item.Group>
            </Container>
        )
    }
}

export default withRouter(ListarComponent)