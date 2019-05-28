import React from 'react'
import { Button, Form, Icon, Modal, Select, Image, Grid, Message } from 'semantic-ui-react'
import { getAllProduto } from '../categoria/api'
import { create, update, upload } from './api'
import { urlStorage } from './../app/api'

class ProdutoModalComponent extends React.Component {
    
    state = {
        modalOpen: false,
        id: null,
        nome: '',
        descricao: '',
        valor: null,
        categorias: [],
        categoria: null,
        categoriaId: null,
        msgError: null,
        categoria_nome: '',
        imagemPath: null,
        image: null,
        file: null,
    }

    onOpen = () => {
        const produto = {...this.props.produto}
        getAllProduto().then((res) => {
            if (produto.id) {
                this.setState({ 
                    modalOpen: true,
                    categorias: res.data || [],
                    ...this.props.produto,
                    imagemPath: this.props.produto.imagemPath ? `${urlStorage}/${this.props.produto.imagemPath}` : null,
                    categoriaId: this.props.produto.categoria._id,
                })
            } else {
                this.setState({ 
                    categorias: res.data || [],
                    modalOpen: true,
                    id: null,
                    nome: '',
                    descricao: '',
                    valor: null,
                    categoria: null,
                    msgError: null,
                    categoria_nome: '',
                    imagemPath: null,
                    image: null,
                    file: null,
                })
            }
        })
    }
    
    onClose = () => {
        this.setState({ modalOpen: false })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onCategoriaSelected = (e, { value }) => {
        this.setState({
            categoria: value
        })
    }

    onChangeImagem = (e) => {
        let file = e.target.files[0]
        this.setState({
            image: URL.createObjectURL(file),
            file
        })
    }

    onSalvar = () => {
        const { id, nome, descricao, valor, categoria, file, categoriaId } = this.state
        if (categoria) {
            if (id) {
                update({
                    id,
                    categoriaId: categoria ? categoria : categoriaId,
                    nome,
                    descricao,
                    valor,
                }).then(res => {
                    this.onClose()
                    this.setState({ msgError: null })
                    this.props.getProdutos(res.data)
                })
            } else {
                create({
                    categoriaId: categoria,
                    nome,
                    descricao,
                    valor,
                }).then(res => {
                    if (file) {
                        const data = new FormData() 
                        data.append('file', file)
                        return upload(data, res.data)
                    } else {
                        return null
                    }
                }).then(() => {
                    this.onClose()
                    this.setState({ msgError: null })
                    this.props.getProdutos()
                })
            }
        } else {
            this.setState({ msgError: 'Por favor, selecione a categoria.' })
        }
    }

    img = () => {
        const { image, imagemPath } = this.state
        if (image) {
            return <Image wrapped size='medium' src={image} />
        } else  if (imagemPath) {
            return <Image wrapped size='medium' src={imagemPath} />
        } else {
            return <Image wrapped size='medium' src='https://react.semantic-ui.com/images/wireframe/square-image.png' />
        }
    }

    render() {
        const { id, nome, descricao, valor, categorias, categoria_nome, msgError } = this.state
        return (
            <Modal
                trigger={this.props.children}
                open={this.state.modalOpen}
                onClose={this.onClose}
                onOpen={this.onOpen}
            >
                <Icon link size='large' name='cancel' style={{ float: 'right', margin: '10px' }} onClick={this.onClose}/>
                <Modal.Header>Produto</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form onSubmit={this.onSalvar}>
                            <Grid>
                                <Grid.Column width={4}>
                                    {this.img()}
                                    {!id && (
                                        <div>
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={this.onChangeImagem}
                                                ref={e => { this.fileInput = e }}/>
                                            <Button attached='bottom' onClick={() => this.fileInput.click()}>Adicionar foto</Button>
                                        </div>
                                    )}
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Form.Group>
                                        <Form.Field
                                            width={8}
                                            control={Select}
                                            label='Categoria'
                                            name='categoria'
                                            options={categorias.map(categoria => {
                                                return { key: categoria._id, text: categoria.nome, value: categoria._id }
                                            })}
                                            onChange={this.onCategoriaSelected}
                                        />
                                        <Form.Input type="number" width={8} label="Valor" name="valor" value={valor} onChange={this.onChange}/>
                                    </Form.Group>
                                    <Form.Input label="Nome" name="nome" value={nome} onChange={this.onChange}/>
                                    <Form.TextArea label="Descrição" name="descricao" value={descricao} onChange={this.onChange}/>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    { msgError && (
                        <Message floated='left' compact warning>
                            {msgError}
                        </Message>
                    )}
                    <Button primary type='submit' onClick={this.onSalvar}>
                        <Icon name="plus" />
                        Salvar
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ProdutoModalComponent