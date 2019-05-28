import React from 'react';
import { Container, Grid, Header, Segment, Button, Icon, Image, Accordion, Item } from 'semantic-ui-react'
import { getAll, upload, removeProduto, getPedido, uploadProduto, active, getCliente } from './api'
import { upload as uploadCliente } from './../cliente/api'
import { urlStorage } from './../app/api'
import ModalRemoveComponent from './ModalRemoveComponent'
import ModalProdutoComponent from './ModalProdutoComponent'
import ModalProdutoEditarComponent from './ModalProdutoEditarComponent'
import ModalRemoveClienteComponent from './../cliente/ModalRemoveComponent'

class DistribuidorComponent extends React.Component {

    state = {
        id: null,
        distribuidores: [],
        produtos: [],
        pedidos: [],
        clientes: [],
        produtoId: null,
        clienteId: null,
        tabDetalhe: true,
        tabProduto: false,
        tabPedido: false,
        tabCliente: false,
        imagemPath: null,
        activeIndex: 0
    }

    componentDidMount() {
        this.get()
    }

    get = () => {
        getAll().then(res => {
            this.setState({                
                distribuidores: res.data,
                id: null,
            })
        })
    }

    getProdutos = (produto) => {
        this.setState({                
            produtos: [...this.state.produtos, produto]
        })
    }

    onCadastrar = () => {
        this.props.history.push('/admin/distribuidor/cadastrar');
    }

    onEditar = () => {
        this.props.history.push('/admin/distribuidor/' + this.state.id + '/editar');
    }

    onSelect = (distribuidor) => {
        this.setState({
            ...distribuidor,
            id: distribuidor._id,
            produtos: distribuidor.produtos
        })
        getPedido(distribuidor._id).then(res => {
            this.setState({
                pedidos: res.data
            })
        })
        getCliente(distribuidor._id).then(res => {
            this.setState({
                clientes: res.data
            })
        })
    }

    onTab = (tab) => {
        if (tab === 'detalhe') this.setState({ tabDetalhe: true, tabProduto: false, tabPedido: false, tabCliente: false })
        if (tab === 'produto') this.setState({ tabDetalhe: false, tabProduto: true, tabPedido: false, tabCliente: false })
        if (tab === 'pedido') this.setState({ tabDetalhe: false, tabProduto: false, tabPedido: true, tabCliente: false })
        if (tab === 'cliente') this.setState({ tabDetalhe: false, tabProduto: false, tabPedido: false, tabCliente: true })
    }

    onUpload = (e) => {
        let file = e.target.files[0]
        const data = new FormData() 
        data.append('file', file)
        upload(data, this.state.id).then(res => {
            this.get()
        })
    }

    onUploadProduto = (e) => {
        const { produtoId } = this.state
        let file = e.target.files[0]
        const data = new FormData() 
        data.append('file', file)
        uploadProduto(data, this.state.id, produtoId).then(res => {
            this.get()
        })
    }

    onUploadProdutoSelect = (produtoId) => {
        this.setState({ produtoId })
    }
    
    onUploadCliente = (e) => {
        const { clienteId } = this.state
        let file = e.target.files[0]
        const data = new FormData() 
        data.append('file', file)
        uploadCliente(data, clienteId).then(res => {
            this.get()
        })
    }
    
    onUploadClienteSelect = (clienteId) => {
        this.setState({ clienteId })
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

    onAtivar = (distribuidorId) => {
        active(distribuidorId).then(res => {
            this.get()
        })
    }

    onCadastrarCliente = () => {
        this.props.history.push('/admin/distribuidor/' + this.state.id + '/cliente/cadastrar');
    }

    onEditarCliente = (clienteId) => {
        this.props.history.push('/admin/distribuidor/' + this.state.id + '/cliente/' + clienteId + '/editar');
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }
    
    render() {
        const { 
            distribuidores, id, tabDetalhe, tabProduto, imagemPath, produtos, activeIndex, tabPedido, tabCliente,
            nome, codId, razaoSocial, cnpj, telefone, responsavel, endereco, dadosPagamento, pedidos, clientes,
            pagamento, categoria, active
        } = this.state
        return(
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Distribuidores
                                <Button primary floated='right' onClick={this.onCadastrar}> 
                                    <Icon name='plus' /> Cadastrar 
                                </Button>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            {distribuidores.length !== 0 ? (
                                <Segment.Group>
                                    {(distribuidores || []).map((d, i) => (
                                        <div>
                                            { id === d._id ? (
                                                <Segment tertiary key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(d)}>{d.codId} - {d.nome}</Segment>
                                            ) : (
                                                <Segment key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(d)}>{d.codId} - {d.nome}</Segment>
                                            )}
                                        </div>
                                    ))}
                                </Segment.Group>
                            ) : (
                                <Header h="5">Nenhum distribuidor cadastrado</Header>
                            )}
                        </Grid.Column>
                        <Grid.Column width={11}>
                            { id && (
                                <div>
                                    <Button.Group floated='left'>
                                        { tabDetalhe ? (
                                            <Button onClick={() => this.onTab('detalhe')} positive>Detalhes</Button>
                                        ) : (
                                            <Button onClick={() => this.onTab('detalhe')}>Detalhes</Button>
                                        )}
                                        { tabProduto ? (
                                            <Button onClick={() => this.onTab('produto')} positive>Produtos</Button>
                                        ) : (
                                            <Button onClick={() => this.onTab('produto')}>Produtos</Button>
                                        )}
                                        { tabPedido ? (
                                            <Button onClick={() => this.onTab('pedido')} positive>Pedidos</Button>
                                        ) : (
                                            <Button onClick={() => this.onTab('pedido')}>Pedidos</Button>
                                        )}
                                        { tabCliente ? (
                                            <Button onClick={() => this.onTab('cliente')} positive>Clientes</Button>
                                        ) : (
                                            <Button onClick={() => this.onTab('cliente')}>Clientes</Button>
                                        )}
                                    </Button.Group>
                                    <br />
                                    { tabDetalhe && (
                                        <Segment>
                                            <Header as='h3'>
                                                Empresa
                                                {active ? (
                                                    <ModalRemoveComponent getDistribuidor={this.get} distribuidor={{ id, razaoSocial }}>
                                                        <Button color='red' floated='right'> 
                                                            <Icon name='archive' /> Desativar 
                                                        </Button>
                                                    </ModalRemoveComponent>
                                                ) : (
                                                    <Button positive floated='right' onClick={() => this.onAtivar(id)}> 
                                                        <Icon name='check' /> Ativar 
                                                    </Button>
                                                )}
                                                <Button primary floated='right' onClick={this.onEditar}> 
                                                    <Icon name='edit' /> Editar 
                                                </Button>
                                                <Button secundary floated='right' onClick={() => this.fileInput.click()}> 
                                                    <Icon name='camera' /> Alterar Capa
                                                </Button>
                                                <input
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={this.onUpload}
                                                    ref={e => { this.fileInput = e }}
                                                />       
                                            </Header>
                                            <br />
                                            <Image src={imagemPath ? `${urlStorage}/${imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} size='medium' floated='right' rounded />
                                            <p>Nome: {nome}</p>
                                            <p>Código: {codId}</p>
                                            <p>Razão Social: {razaoSocial}</p>
                                            <p>CNPJ: {cnpj}</p>
                                            <p>Telefone: {telefone}</p>
                                            <p>Categoria: {categoria.nome}</p>
                                            <Header as='h4'>Responsável</Header>
                                            <p>Nome: {responsavel.nomeCompleto}</p>
                                            <p>CPF: {responsavel.cpf}</p>
                                            <p>RG: {responsavel.rg}</p>
                                            <p>E-mail: {responsavel.email}</p>
                                            <p>Celular: {responsavel.celular}</p>
                                            <Header as='h4'>Endereço</Header>
                                            <p>Endereço: {endereco.nomeEndereco}</p>
                                            <p>Número: {endereco.numero}</p>
                                            <p>Complemento: {endereco.complemento}</p>
                                            <p>Bairro: {endereco.bairro}</p>
                                            <p>CEP: {endereco.cep}</p>
                                            <p>Cidade: {endereco.cidade}</p>
                                            <p>Estado: {endereco.estado}</p>
                                            <Header as='h4'>Pagamento</Header>
                                            <p>Modelo de pagamento: {dadosPagamento.categoria.nome}</p>
                                            <p>Valor: {dadosPagamento.valor}</p>
                                            { responsavel.nomeCompleto == dadosPagamento.responsavel.nomeCompleto ? (
                                                <Header as='h4'>Os dados de pagamento e o mesmo do responsável e endereço acima.</Header>
                                            ) : (
                                                <div>
                                                    <Header as='h4'>Pagamento</Header>
                                                    <p>Nome: {dadosPagamento.responsavel.nomeCompleto}</p>
                                                    <p>CPF: {dadosPagamento.responsavel.cpf}</p>
                                                    <p>RG: {dadosPagamento.responsavel.rg}</p>
                                                    <p>E-mail: {dadosPagamento.responsavel.email}</p>
                                                    <p>Celular: {dadosPagamento.responsavel.celular}</p>
                                                    <p>Endereço: {dadosPagamento.endereco.nomeEndereco}</p>
                                                    <p>Número: {dadosPagamento.endereco.numero}</p>
                                                    <p>Complemento: {dadosPagamento.endereco.complemento}</p>
                                                    <p>Bairro: {dadosPagamento.endereco.bairro}</p>
                                                    <p>CEP: {dadosPagamento.endereco.cep}</p>
                                                    <p>Cidade: {dadosPagamento.endereco.cidade}</p>
                                                    <p>Estado: {dadosPagamento.endereco.estado}</p>
                                                </div>
                                            )}
                                        </Segment>
                                    )}
                                    { tabProduto && (
                                        <Segment style={{ marginRight: 30 }}>
                                            <Header as='h3'>
                                                <ModalProdutoComponent getProdutos={this.getProdutos} id={id}>
                                                    <Button primary floated='right' size='tiny'> 
                                                        <Icon name='plus' /> Adicionar 
                                                    </Button>
                                                </ModalProdutoComponent>
                                                Produtos
                                            </Header>
                                            
                                            {produtos.length !== 0 ? (
                                                <Accordion>
                                                    {(produtos || []).map((p, i) => (
                                                        <div>
                                                            <Accordion.Title active={activeIndex === i} index={i} onClick={this.handleClick}>
                                                                <Icon name='dropdown' /> <strong>{p.nome}</strong>
                                                            </Accordion.Title>
                                                            <Accordion.Content active={activeIndex === i} style={{ marginBottom: 20 }}>
                                                                <Image src={p.imagemPath ? `${urlStorage}/${p.imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} size='tiny' floated='left' rounded />
                                                                {p.nome} - {p.categoria.nome}
                                                                <br />
                                                                R$: {p.valor}
                                                                <br />
                                                                {p.descricao}
                                                                <br />
                                                                <Button color='red' floated='right' onClick={() => this.onRemoverProduto(p._id)}> 
                                                                    <Icon name='cancel' /> Retirar 
                                                                </Button>
                                                                <ModalProdutoEditarComponent get={this.get} produto={p} distribuidorId={id}>
                                                                    <Button primary floated='right'> 
                                                                        <Icon name='edit' /> Editar 
                                                                    </Button>
                                                                </ModalProdutoEditarComponent>
                                                                <Button secundary floated='right' onClick={() => {
                                                                    this.onUploadProdutoSelect(p._id)
                                                                    return this.fileInput.click()
                                                                }}> 
                                                                    <Icon name='camera' /> Alterar foto
                                                                </Button>
                                                                <input
                                                                    type="file"
                                                                    style={{ display: 'none' }}
                                                                    onChange={this.onUploadProduto}
                                                                    ref={e => { this.fileInput = e }}
                                                                /> 
                                                                <br />
                                                            </Accordion.Content>
                                                        </div>
                                                    ))}
                                                </Accordion>
                                            ) : (
                                                <Header as='h4'>Nenhum produto adicionado</Header>
                                            )}
                                        </Segment>
                                    )}
                                    { tabPedido && (
                                        <Segment>
                                            <Header as='h3'>Pedidos</Header>
                                            <div>
                                                { pedidos.length !== 0 ? (
                                                    <Accordion>
                                                        {(pedidos || []).map((p, i) => (
                                                            <div>
                                                                <Accordion.Title active={activeIndex === i} index={i} onClick={this.handleClick}>
                                                                    <Icon name='dropdown' /> 
                                                                    <strong>
                                                                        <small style={{ fontSize: 15 }}>Data da solicitação: {new Date(p.createdAt).toLocaleDateString('en-GB')}</small> | 
                                                                        <small style={{ fontSize: 15 }}> ValorTotal de R$ {p.valorTotal}</small> | 
                                                                        {p.cliente ? (<small style={{ fontSize: 15 }}> Cliente: {p.cliente.nome}</small>) : (<small style={{ fontSize: 15 }}> Cliente Id: {p.clienteId}</small>)} | 
                                                                        {p.entrega ? (
                                                                            <small style={{ color: 'green', fontSize: 15 }} > Pedido entregue</small>                                                                        
                                                                            ) : (
                                                                            <small style={{ color: 'red', fontSize: 15 }}> Pedido não foi entregue</small>
                                                                        )}
                                                                    </strong>                                                                 
                                                                </Accordion.Title>
                                                                <Accordion.Content active={activeIndex === i}>
                                                                    <Item.Group divided unstackable>
                                                                        {(p.produtos || []).map((a, i) => (
                                                                            <div>
                                                                                <Item.Content style={{ marginBottom: 50 }}>
                                                                                    <Item.Image size='tiny' src={a.imagemPath ? `${urlStorage}/${a.imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} size='tiny' floated='left' rounded />
                                                                                    <Item.Header>
                                                                                        {a.nome}
                                                                                        <br />
                                                                                        R$ {a.valor}
                                                                                    </Item.Header>
                                                                                    <Item.Description>
                                                                                        <p>{a.descricao}</p>   
                                                                                    </Item.Description>
                                                                                </Item.Content>
                                                                            </div>
                                                                        ))}
                                                                    </Item.Group>
                                                                </Accordion.Content>
                                                            </div>
                                                        ))}
                                                    </Accordion>
                                                ) : (
                                                    <Header as='h4'>Nenhum pedido solicitado.</Header>
                                                )}
                                            </div>
                                        </Segment>
                                    )}
                                    { tabCliente && (
                                        <Segment>
                                            <Header as='h3'>
                                                <Button primary floated='right' size='tiny' onClick={this.onCadastrarCliente}> 
                                                    <Icon name='plus' /> Cadastrar 
                                                </Button>
                                                Clientes
                                            </Header>
                                            <div>
                                                { clientes.length !== 0 ? (
                                                    <Accordion>
                                                        {(clientes || []).map((c, i) => (
                                                            <div>
                                                                <Accordion.Title active={activeIndex === i} index={i} onClick={this.handleClick}>
                                                                    <Icon name='dropdown' /> 
                                                                    {c.nome}                                                              
                                                                </Accordion.Title>
                                                                <Accordion.Content active={activeIndex === i}>
                                                                    <Item.Group divided unstackable>
                                                                        <Item>
                                                                            <Item.Image size='tiny' src={c.imagemPath ? `${urlStorage}/${c.imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} />
                                                                            <Item.Content>
                                                                                <Item.Header>{c.nome}</Item.Header>
                                                                                <Item.Description>
                                                                                    <p>Código: {c.codId}</p>
                                                                                    <p>CPF: {c.cpf}</p>
                                                                                    <p>RG: {c.rg}</p>
                                                                                    <p>E-mail: {c.email}</p>
                                                                                    <p>Telefone: {c.telefone}</p>
                                                                                    <p>Celular: {c.celular}</p>
                                                                                    <p>Endereço: {endereco.nomeEndereco}</p>
                                                                                    <p>Número: {endereco.numero}</p>
                                                                                    <p>Complemento: {endereco.complemento}</p>
                                                                                    <p>Bairro: {endereco.bairro}</p>
                                                                                    <p>CEP: {endereco.cep}</p>
                                                                                    <p>Cidade: {endereco.cidade}</p>
                                                                                    <p>Estado: {endereco.estado}</p>
                                                                                </Item.Description>
                                                                                <ModalRemoveClienteComponent getCliente={this.get} cliente={{ id: c._id, nome: c.nome }}>
                                                                                    <Button color='red' floated='right'> 
                                                                                        <Icon name='archive' /> Desativar 
                                                                                    </Button>
                                                                                </ModalRemoveClienteComponent>
                                                                                <Button primary floated='right' onClick={() => this.onEditarCliente(c._id)}> 
                                                                                    <Icon name='edit' /> Editar 
                                                                                </Button>
                                                                                <Button secundary floated='right' onClick={() => {
                                                                                    this.onUploadClienteSelect(c._id)
                                                                                    return this.fileInput.click()
                                                                                }}> 
                                                                                    <Icon name='camera' /> Alterar foto
                                                                                </Button>
                                                                                <input
                                                                                    type="file"
                                                                                    style={{ display: 'none' }}
                                                                                    onChange={this.onUploadCliente}
                                                                                    ref={e => { this.fileInput = e }}
                                                                                /> 
                                                                                <br />
                                                                            </Item.Content>
                                                                        </Item>
                                                                    </Item.Group>
                                                                </Accordion.Content>
                                                            </div>
                                                        ))}
                                                    </Accordion>
                                                ) : (
                                                    <Header as='h4'>Nenhum cliente cadastrado.</Header>
                                                )}
                                            </div>
                                        </Segment>
                                    )}
                                </div>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default DistribuidorComponent