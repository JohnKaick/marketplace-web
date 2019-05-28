import React from 'react';
import { Image, Button, Container, Header, Item, Message, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { getPedido } from './api';
import { removeProduto, uploadProduto, get, getCliente } from './../distribuidor/api'
import ModalProdutoComponent from './../distribuidor/ModalProdutoComponent'
import ModalProdutoEditarComponent from './../distribuidor/ModalProdutoEditarComponent'
import { urlStorage } from './../app/api'

class PedidoComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            pedidos: [],
            produtos: [],
            clientes: [],
            id: null,
            distribuidorId: null,
            produtoId: null,
            nome: '',
            imagemPath: '',
            tabPedido: true,
            tabProduto: false,
            tabCliente: false,
            clientes: false,
        }
    }
    
    componentDidMount() {
        const { distribuidorId } = this.props.match.params

        this.setState({ distribuidorId })

        getPedido(distribuidorId).then((res) => {
            this.setState({ 
                pedidos: res.data.pedidos || [],
                ...res.data.distribuidor,
                id: res.data.distribuidor._id
            })
            return getCliente(res.data.distribuidor._id)
        }).then(res => {
            this.setState({ 
                clientes: res.data || [],
            })
        })
        
    }

    onGet = () => {
        get(this.state.id).then(res => {
            this.setState({
                ...res.data,
                id: res.data._id
            })
        })
    }

    onPedidoDetalhe(id) {
        this.props.history.push('/distribuidor/' + this.state.distribuidorId + '/pedido/' + id + '/detalhe');
    }

    onClienteDetalhe(id) {
        this.props.history.push('/distribuidor/' + this.state.distribuidorId + '/detalhe/cliente/' + id);
    }

    onTab = (tab) => {
        if (tab === 'detalhe') this.setState({ tabPedido: true, tabProduto: false, tabCliente: false })
        if (tab === 'produto') this.setState({ tabPedido: false, tabProduto: true, tabCliente: false })
        if (tab === 'cliente') this.setState({ tabPedido: false, tabProduto: false, tabCliente: true })
    }

    getProdutos = (produto) => {
        this.setState({                
            produtos: [...this.state.produtos, produto]
        })
    }

    onRemoverProduto = (produtoId) => {
        const { produtos, id } = this.state
        removeProduto({ id, produtoId }).then(res => {
            let prds = []
            produtos.forEach(p => {
                if (p._id !== produtoId) prds.push(p)
            })
            this.setState({ produtos: prds })
        })
    }

    onUploadProduto = (e) => {
        const { produtoId } = this.state
        let file = e.target.files[0]
        const data = new FormData() 
        data.append('file', file)
        uploadProduto(data, this.state.id, produtoId).then(res => {
            this.onGet()
        })
    }

    onUploadProdutoSelect = (produtoId) => {
        this.setState({ produtoId })
    }

    onCadastrarCliente = () => {
        const { distribuidorId } = this.state
        this.props.history.push(`/distribuidor/${distribuidorId}/cadastrar/cliente`);
    }

    render() {
        const { pedidos, imagemPath, nome, tabPedido, tabProduto, produtos, id, tabCliente, clientes } = this.state
        return (
            <div>
                <Header as='h2' style={{ marginTop: 20, marginLeft: 20 }}>
                    {nome}
                </Header>
                <Image src={imagemPath ? `${urlStorage}/${imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} fluid />
                <Container>
                    <br />
                    <Button.Group floated='left'>
                        { tabPedido ? (
                            <Button onClick={() => this.onTab('detalhe')} positive>Pedidos</Button>
                        ) : (
                            <Button onClick={() => this.onTab('detalhe')}>Pedidos</Button>
                        )}
                        { tabProduto ? (
                            <Button onClick={() => this.onTab('produto')} positive>Produtos</Button>
                        ) : (
                            <Button onClick={() => this.onTab('produto')}>Produtos</Button>
                        )}
                        { tabCliente ? (
                            <Button onClick={() => this.onTab('cliente')} positive>Clientes</Button>
                        ) : (
                            <Button onClick={() => this.onTab('cliente')}>Clientes</Button>
                        )}
                    </Button.Group>
                    <br />
                    { tabPedido && (
                        <div style={{ paddingTop: 30 }}>
                            <Header as='h3'>
                                Pedidos
                            </Header>
                            {pedidos.length == 0 ? (
                                <Message info>
                                    <Message.Header>Sem pedidos solicitados.</Message.Header>
                                </Message>
                            ) : (
                                <Item.Group divided unstackable>
                                {(pedidos || []).map(p => (
                                    <Item>
                                        <Item.Content>
                                            { p.cliente ? (
                                                <Item.Header as='a'>Cliente: {p.cliente.nome}</Item.Header>
                                            ) : (
                                                <Item.Header as='a'>Cliente ID: {p.clienteId}</Item.Header>
                                            )}
                                            <Item.Meta>Data da solicitação: {new Date(p.createdAt).toLocaleDateString('en-GB')}</Item.Meta>
                                            <Item.Description>
                                                Quantidade de produtos: {p.quantidade}
                                                <br />
                                                Valor total: R$ {p.valorTotal}
                                                { p.cliente && (
                                                    <div>
                                                        <br />
                                                        Telefone: {p.cliente.celular}
                                                        <br />
                                                        Endereço: {p.cliente.endereco.nomeEndereco}, {p.cliente.endereco.numero} - {p.cliente.endereco.complemento} 
                                                        <br />
                                                        {p.cliente.endereco.bairro} - {p.cliente.endereco.cep}
                                                        <br />
                                                        {p.cliente.endereco.cidade} - {p.cliente.endereco.estado}
                                                    </div>
                                                )}
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
                        </div>
                    )}
                    { tabProduto && (
                        <div style={{ paddingTop: 30 }}>
                            <ModalProdutoComponent getProdutos={this.getProdutos} id={id}>
                                <Button floated='left' primary icon>
                                    <Icon name='plus' /> Adicionar produto
                                </Button>
                            </ModalProdutoComponent>
                            {produtos.length == 0 ? (
                                <Message info style={{ marginTop: 50 }}>
                                    <Message.Header>Nenhum produto adicionado.</Message.Header>
                                </Message>
                            ) : (
                                <Item.Group divided unstackable>
                                    {(produtos || []).map(p => (
                                        <Item>
                                            <Item.Content>
                                            <Item.Image size='tiny' src={p.imagemPath ? `${urlStorage}/${p.imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} />
                                                <Item.Header style={{ padding: 10 }}>
                                                    <br />
                                                    {p.nome}<small> - {p.categoria.nome}</small>
                                                    <br />                                                    
                                                    <small>R$ {p.valor}</small>
                                                </Item.Header>
                                                <Button.Group floated='right' vertical>
                                                    <ModalProdutoEditarComponent get={this.onGet} produto={p} distribuidorId={id}>
                                                        <Button floated='right' primary icon>
                                                            <Icon name='edit' />
                                                        </Button>
                                                    </ModalProdutoEditarComponent>
                                                    <Button floated='right' icon onClick={() => {
                                                        this.onUploadProdutoSelect(p._id)
                                                        return this.fileInput.click()
                                                    }}>
                                                        <Icon name='camera' />
                                                    </Button>
                                                    <input
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        onChange={this.onUploadProduto}
                                                        ref={e => { this.fileInput = e }}
                                                    /> 
                                                    <Button floated='right' color='red' icon onClick={() => this.onRemoverProduto(p._id)}>
                                                        <Icon name='cancel' />
                                                    </Button>
                                                </Button.Group>
                                                <Item.Description>
                                                    <p>{p.descricao}</p>   
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
                                    ))}
                                </Item.Group>
                            )}
                        </div>
                    )}
                    { tabCliente && (
                        <div style={{ paddingTop: 30 }}>
                            <Button floated='left' primary icon onClick={this.onCadastrarCliente}>
                                <Icon name='plus' /> Cadastrar cliente
                            </Button>
                            {clientes.length == 0 ? (
                                <Message info style={{ marginTop: 50 }}>
                                    <Message.Header>Nenhum cliente cadastrado.</Message.Header>
                                </Message>
                            ) : (
                                <Item.Group divided unstackable style={{ marginTop: 50 }}>
                                    {(clientes || []).map(c => (
                                        <Item>
                                            <Item.Image size='tiny' src={c.imagemPath ? `${urlStorage}/${c.imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} />
                                            <Item.Content>
                                                <Item.Header>{c.nome}</Item.Header>
                                                <Item.Description>
                                                    <p>E-mail: {c.email}</p>
                                                    <p>Telefone: {c.telefone}</p>
                                                </Item.Description>
                                                <Item.Extra>
                                                    <Button primary floated='left' onClick={() => this.onClienteDetalhe(c._id)}>
                                                        <Icon name='list layout' /> Detalhes do cliente
                                                    </Button>
                                                </Item.Extra>
                                            </Item.Content>
                                        </Item>
                                    ))}
                                </Item.Group>
                            )}
                        </div>
                    )}
                </Container>
            </div>
        )
    }
}

export default withRouter(PedidoComponent)