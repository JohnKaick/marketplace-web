import React from 'react'
import { Button, Form, Icon, Modal, Select, Grid, Message } from 'semantic-ui-react'
import { getAllProduto } from '../categoria/api'
import { updateProduto } from './api'

class CadastroProdutoModalComponent extends React.Component {

    state = {
        modalOpen: false,
        id: null,
        distribuidorId: null,
        nome: '',
        descricao: '',
        valor: null,
        imagemPath: null,
        categoria: null,
        categorias: [],
        categoriaId: null,
    }

    onOpen = () => {
        this.setState({
            modalOpen: true,
            ...this.props.produto,
            id: this.props.produto._id,
            distribuidorId: this.props.distribuidorId,
            categoriaId: this.props.produto.categoria._id
        })
        getAllProduto().then((res) => {
            this.setState({ 
                categorias: res.data || [],
            })
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
    
    onSalvar = () => {
        const { 
            id, nome, valor, descricao, categoria, categoriaId, distribuidorId
        } = this.state
        updateProduto({
            id: distribuidorId,
            produtoId: id,
            nome,
            descricao,
            valor,
            categoriaId: categoria ? categoria : categoriaId
        }).then(() => {
            this.onClose()
            this.props.get()
        })
    }

    render() {
        const { 
            id, nome, valor, descricao, categorias
        } = this.state
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
                        <Form>
                            <Grid>
                                <Grid.Column>
                                    <Form.Group>
                                        <Form.Field
                                            width={8}
                                            control={Select}
                                            label='Categoria'
                                            name='nvCategoria'
                                            options={categorias.map(c => {
                                                return { key: c._id, text: c.nome, value: c._id }
                                            })}
                                            onChange={this.onCategoriaSelected}
                                        />
                                        <Form.Input width={8} type="number" label="Valor" name="valor" value={valor} onChange={this.onChange}/>
                                    </Form.Group>
                                    <Form.Input label="Nome" name="nome" value={nome} onChange={this.onChange}/>
                                    <Form.TextArea label="Descrição" name="descricao" value={descricao} onChange={this.onChange}/>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary type='submit' onClick={this.onSalvar}>
                        <Icon name="plus" />
                        Salvar
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default CadastroProdutoModalComponent