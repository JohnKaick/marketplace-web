import React from 'react'
import { Button, Form, Icon, Modal, Select, Image, Grid, Message, Segment, Header } from 'semantic-ui-react'
import { getAllProduto } from '../categoria/api'
import { upload, getAll, create } from './../produto/api'
import { urlStorage } from './../app/api'
import { createProduto, selectProduto } from './api'

class CadastroProdutoModalComponent extends React.Component {

    state = {
        modalOpen: false,
        distribuidorId: null,
        tabSelecione: true,
        tabCadastro: false,
        msgError: null,
        produtos: [],
        id: null,
        nome: '',
        descricao: '',
        valor: null,
        imagemPath: null,
        categoria: null,
        nvNome: '',
        nvDescricao: '',
        nvValor: null,
        nvCategorias: [],
        nvCategoria: null,
        nvImagemPath: null,
        nvImagem: null,
        nvFile: null,
    }

    onOpen = () => {
        getAllProduto().then((res) => {
            this.setState({ 
                nvCategorias: res.data || [],
            })
            return getAll()
        }).then(res => {
            this.setState({ 
                produtos: res.data || [],
                modalOpen: true,
                distribuidorId: this.props.id
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
            nvCategoria: value
        })
    }

    onChangeImagem = (e) => {
        let file = e.target.files[0]
        this.setState({
            nvImagem: URL.createObjectURL(file),
            nvFile: file
        })
    }

    onTab = () => {
        this.setState({
            tabSelecione: !this.state.tabSelecione,
            tabCadastro: !this.state.tabCadastro 
        })
    }
    
    onSelect = (produto) => {
        this.setState({ 
            id: produto._id,
            nome: produto.nome,
            categoria: produto.categoria.nome,
            imagemPath: produto.imagemPath
        })
    }
    
    onSalvar = () => {
        const { 
            distribuidorId, tabCadastro, tabSelecione, id,
            nvNome, nvValor, nvDescricao, nvCategoria, nvFile, nvImagem,
            nome, valor, descricao, imagemPath,
        } = this.state
        let novaImagemPath = null
        let novoProdutoId = null
        if (tabCadastro) {
            create({
                nome: nvNome,
                valor: nvValor,
                descricao: nvDescricao,
                categoriaId: nvCategoria
            }).then(res => {
                novoProdutoId = res.data
                if (nvFile) {
                    const data = new FormData() 
                    data.append('file', nvFile)                    
                    return upload(data, res.data)
                } else {
                    return null
                }
            }).then(res => {
                novaImagemPath = res.data
                return createProduto({
                    id: distribuidorId,
                    produtoId: novoProdutoId,
                })
            }).then(res => {
                this.onClose()
                this.setState({ msgError: null })
                this.props.getProdutos({
                    nome: nvNome,
                    valor: nvValor,
                    descricao: nvDescricao,
                    imagemPath: novaImagemPath || null,
                })
            })
        }
        if (tabSelecione) {
            selectProduto({
                id: distribuidorId,
                produtoId: id,
                valor,
                descricao
            }).then(res => {
                this.onClose()
                this.setState({ msgError: null })
                this.props.getProdutos({
                    nome,
                    valor,
                    descricao,
                    imagemPath
                })
            })
        }
    }

    render() {
        const { 
            tabSelecione, tabCadastro, msgError, produtos,
            id, nome, descricao, valor, imagemPath, categoria,
            nvNome, nvDescricao, nvValor, nvCategorias, nvImagem
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
                    <Modal.Description style={{ paddingTop: 50 }}>
                        <Form onSubmit={this.onSalvar}>
                            <Grid>
                                <Grid.Column width={4}>
                                    <Image wrapped size='medium' src={ nvImagem ? nvImagem : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} />
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={this.onChangeImagem}
                                        ref={e => { this.fileInput = e }}/>
                                    <Button attached='bottom' onClick={() => this.fileInput.click()}>Adicionar foto</Button>
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Form.Group>
                                        <Form.Field
                                            width={8}
                                            control={Select}
                                            label='Categoria'
                                            name='nvCategoria'
                                            options={nvCategorias.map(nvCategoria => {
                                                return { key: nvCategoria._id, text: nvCategoria.nome, value: nvCategoria._id }
                                            })}
                                            onChange={this.onCategoriaSelected}
                                        />
                                        <Form.Input width={8} type="number" label="Valor" name="nvValor" value={nvValor} onChange={this.onChange}/>
                                    </Form.Group>
                                    <Form.Input label="Nome" name="nvNome" value={nvNome} onChange={this.onChange}/>
                                    <Form.TextArea label="Descrição" name="nvDescricao" value={nvDescricao} onChange={this.onChange}/>
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

export default CadastroProdutoModalComponent