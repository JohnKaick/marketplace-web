import React from 'react';
import { Container, Grid, Header, Segment, Button, Icon, Image } from 'semantic-ui-react'
import { getAll, getPedido, upload } from './api'
import { urlStorage } from './../app/api'
import ModalRemoveComponent from './ModalRemoveComponent'

class ClienteComponent extends React.Component {

    state = {
        clientes: [],
        distribuidor: null,
        id: null,
        tabDetalhe: true,
        tabPedido: false,
        imagemPath: null,
    }

    componentDidMount() {
        this.get()
    }

    get = () => {
        getAll().then(res => {
            this.setState({ 
                clientes: res.data || [], 
                id: null 
            })
        })
    }
    
    getUpdate = (cliente) => {
        this.get()
        this.setState({ ...cliente })
    }

    onCadastrar = () => {
        this.props.history.push('/admin/cliente/cadastrar');
    }

    onEditar = () => {
        this.props.history.push('/admin/cliente/' + this.state.id + '/editar');
    }

    onSelect = (cliente) => {
        this.setState({
            id: cliente._id,
            distribuidor: cliente.distribuidor || null,
            ...cliente
        })
        getPedido(cliente._id).then(res => {
            this.setState({                
                pedidos: res.data || [],                
            })
        })
    }

    onTab = () => {
        this.setState({
            tabDetalhe: !this.state.tabDetalhe,
            tabPedido: !this.state.tabPedido 
        })
    }

    onUpload = (e) => {
        let file = e.target.files[0]
        const data = new FormData() 
        data.append('file', file)
        upload(data, this.state.id).then(res => {
            this.get()
        })
    }

    render() {
        const { clientes, id, tabDetalhe, tabPedido,
            nome, cpf, rg, email, telefone, celular, endereco, pedidos, imagemPath, codId, distribuidor
        } = this.state
        return(
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Clientes
                                <Button primary floated='right' onClick={this.onCadastrar}> 
                                    <Icon name='plus' /> Cadastrar 
                                </Button>
                            </Header> 
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            {clientes.length !== 0 ? (
                                <Segment.Group>
                                    {(clientes || []).map((c, i) => (
                                        <div>
                                            { id === c._id ? (
                                                <Segment tertiary key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(c)}>{c.codId} - {c.nome}</Segment>
                                            ) : (
                                                <Segment key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(c)}>{c.codId} - {c.nome}</Segment>
                                            )}
                                        </div>
                                    ))}
                                </Segment.Group>
                            ) : (
                                <Header h="5">Nenhum cliente cadastrado</Header>
                            )}
                        </Grid.Column>
                        <Grid.Column width={11}>
                            { id && (
                                <Segment>
                                    <Header as='h3'>
                                        Dados Pessoais
                                        <ModalRemoveComponent getCliente={this.get} cliente={{ id, nome }}>
                                            <Button color='red' floated='right'> 
                                                <Icon name='archive' /> Desativar 
                                            </Button>
                                        </ModalRemoveComponent>
                                        <Button primary floated='right' onClick={this.onEditar}> 
                                            <Icon name='edit' /> Editar 
                                        </Button>
                                        <Button secundary floated='right' onClick={() => this.fileInput.click()}> 
                                            <Icon name='camera' /> Alterar Foto Perfil
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
                                    <p>Distribuidor: {distribuidor.razaoSocial}</p>
                                    <p>Nome: {nome}</p>
                                    <p>Código: {codId}</p>
                                    <p>CPF: {cpf}</p>
                                    <p>RG: {rg}</p>
                                    <p>E-mail: {email}</p>
                                    <p>Telefone: {telefone}</p>
                                    <p>Celular: {celular}</p>
                                    <Header as='h3'>Endereço</Header>
                                    <p>Endereço: {endereco.nomeEndereco}</p>
                                    <p>Número: {endereco.numero}</p>
                                    <p>Complemento: {endereco.complemento}</p>
                                    <p>Bairro: {endereco.bairro}</p>
                                    <p>CEP: {endereco.cep}</p>
                                    <p>Cidade: {endereco.cidade}</p>
                                    <p>Estado: {endereco.estado}</p>
                                </Segment>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default ClienteComponent