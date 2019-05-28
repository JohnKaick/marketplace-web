import React from 'react';
import { Container, Image, Grid, Header, Segment, Button, Icon } from 'semantic-ui-react'
import { getAll, remove, upload } from './api'
import { urlStorage } from './../app/api'
import ModalCadastroComponent from './ModalCadastroComponent'

class ProdutoEstoqueComponent extends React.Component {

    state = {
        produtos: [],
        id: null,
        imagemPath: null
    }

    componentDidMount() {
        this.get()
    }

    get = () => {
        getAll().then(res => {
            this.setState({
                produtos: res.data,
                id: null,
            })
        })
    }

    getUpdate = (produto) => {
        this.get()
        this.setState({ ...produto })
    }

    onSelect = (produto) => {
        this.setState({ 
            id: produto._id,
            ...produto
        })
    }

    onRemover = () => {
        remove(this.state.id).then(() => {
            this.get()
            this.setState({ id: null })
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
        const { produtos, id, nome, valor, descricao, observacao, categoria, imagemPath } = this.state
        return(
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Produtos
                                <ModalCadastroComponent getProdutos={this.get}>
                                    <Button primary floated='right'> 
                                        <Icon name='plus' /> Cadastrar 
                                    </Button>
                                </ModalCadastroComponent>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={5}>
                                {produtos.length !== 0 ? (
                                    <Segment.Group>
                                        {(produtos || []).map((p, i) => (
                                            <div>
                                                { id === p._id ? (
                                                    <Segment tertiary key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(p)}>{p.nome}<br /><small>{p.categoria.nome}</small></Segment>
                                                ) : (
                                                    <Segment key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(p)}>{p.nome}<br /><small>{p.categoria.nome}</small></Segment>
                                                )}
                                            </div>
                                        ))}
                                    </Segment.Group>
                                ) : (
                                    <Header h="5">Nenhum produto cadastrado</Header>
                                )}
                        </Grid.Column>
                        <Grid.Column width={11}>
                            {id && (
                                <Segment>
                                    <Image src={imagemPath ? `${urlStorage}/${imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} size='medium' floated='right' rounded />
                                    <ModalCadastroComponent getProdutos={this.getUpdate} produto={{ id, nome, valor, descricao, observacao, categoria, categoria_nome: categoria.nome, imagemPath }}>
                                        <Button primary> 
                                            <Icon name='edit' /> Editar 
                                        </Button>
                                    </ModalCadastroComponent>
                                    <Button secundary onClick={() => this.fileInput.click()}> 
                                        <Icon name='camera' /> Alterar Foto 
                                    </Button>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={this.onUpload}
                                        ref={e => { this.fileInput = e }}
                                    />                                        
                                    <Header as='h3'>
                                        Detalhes do produto
                                    </Header>
                                    <p>Nome: {nome}</p>
                                    <p>Valor: R$ {valor}</p>
                                    <p>Categoria: {categoria.nome}</p>
                                    <p>Descrição: {descricao}</p>
                                    <Button color='red' style={{ marginTop: 20 }} onClick={this.onRemover}> 
                                        <Icon name='trash' /> Excluir 
                                    </Button>
                                    <br />
                                </Segment>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default ProdutoEstoqueComponent