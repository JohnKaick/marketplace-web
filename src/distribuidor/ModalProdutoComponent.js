import React from 'react'
import { Button, Form, Icon, Modal, Select, Image, Grid, Message, Segment, Header, Responsive } from 'semantic-ui-react'
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
                distribuidorId: this.props.id,
                id: null
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
            console.log(distribuidorId)
            console.log(id)
            console.log(valor)
            console.log(descricao)
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
                    <Responsive {...Responsive.onlyMobile}>
                        <Button.Group floated='left'>
                            { tabSelecione ? (
                                <Button onClick={this.onTab} positive>Selecione produto</Button>
                            ) : (
                                <Button onClick={this.onTab}>Selecione produto</Button>
                            )}
                            { tabCadastro ? (
                                <Button onClick={this.onTab} positive>Cadastre produto</Button>
                            ) : (
                                <Button onClick={this.onTab}>Cadastre produto</Button>
                            )}
                        </Button.Group>
                        { tabSelecione && (
                            <Modal.Description style={{ paddingTop: 50 }}>
                                {id ? (
                                    <Segment>
                                        <Form onSubmit={this.onSalvar}>
                                            <Header as='h3'>
                                                Detalhes do produto
                                            </Header>
                                            <Image src={imagemPath ? `${urlStorage}/${imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} size='small' floated='right' rounded />                                   
                                            <p>Nome: {nome}</p>
                                            <p>Categoria: {categoria}</p>
                                            <Form.Input width={6} floated="left" type="number" label="Valor" name="valor" value={valor} onChange={this.onChange}/>
                                            <Form.TextArea label="Descrição" name="descricao" value={descricao} onChange={this.onChange}/>
                                            <br />
                                        </Form>
                                    </Segment>
                                ) : (
                                    <div>
                                        {produtos.length !== 0 ? (
                                            <Segment.Group>
                                                {(produtos || []).map((p, i) => (
                                                    <Segment key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(p)}>{p.nome}</Segment>
                                                ))}
                                            </Segment.Group>
                                        ) : (
                                            <Header h="5">Nenhum produto cadastrado</Header>
                                        )}
                                    </div>
                                )}
                            </Modal.Description>
                        )}
                        { tabCadastro && (
                            <Modal.Description style={{ paddingTop: 50 }}>
                                <Form>
                                    <Grid>
                                        <Grid.Column>
                                            <Image wrapped size='small' src={ nvImagem ? nvImagem : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} />
                                            <br />
                                            <Button onClick={() => this.fileInput.click()}>Adicionar imagem</Button>
                                            <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={this.onChangeImagem}
                                                ref={e => { this.fileInput = e }}/>
                                            <br />
                                            <br />
                                            <Form.Field
                                                control={Select}
                                                label='Categoria'
                                                name='nvCategoria'
                                                options={nvCategorias.map(nvCategoria => {
                                                    return { key: nvCategoria._id, text: nvCategoria.nome, value: nvCategoria._id }
                                                })}
                                                onChange={this.onCategoriaSelected}
                                            />
                                            <Form.Input label="Nome" name="nvNome" value={nvNome} onChange={this.onChange}/>
                                            <Form.Input type="number" label="Valor" name="nvValor" value={nvValor} onChange={this.onChange}/>
                                            <Form.TextArea label="Descrição" name="nvDescricao" value={nvDescricao} onChange={this.onChange}/>
                                        </Grid.Column>
                                    </Grid>
                                </Form>
                            </Modal.Description>
                        )}
                    </Responsive>
                    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                        <Button.Group floated='left'>
                            { tabSelecione ? (
                                <Button onClick={this.onTab} positive>Selecione produto já cadastrado</Button>
                            ) : (
                                <Button onClick={this.onTab}>Selecione produto já cadastrado</Button>
                            )}
                            { tabCadastro ? (
                                <Button onClick={this.onTab} positive>Cadastre um novo produto</Button>
                            ) : (
                                <Button onClick={this.onTab}>Cadastre um novo produto</Button>
                            )}
                        </Button.Group>
                        { tabSelecione && (
                            <Modal.Description style={{ paddingTop: 50 }}>
                                <Grid>
                                    <Grid.Column width={5}>
                                        {produtos.length !== 0 ? (
                                            <Segment.Group>
                                                {(produtos || []).map((p, i) => (
                                                    <div>
                                                        { id === p._id ? (
                                                            <Segment tertiary key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(p)}>{p.nome}</Segment>
                                                        ) : (
                                                            <Segment key={i} style={{ cursor: 'pointer' }} onClick={() => this.onSelect(p)}>{p.nome}</Segment>
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
                                                    <Form onSubmit={this.onSalvar}>
                                                        <Header as='h3'>
                                                            Detalhes do produto
                                                        </Header>
                                                        <Image src={imagemPath ? `${urlStorage}/${imagemPath}` : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} size='small' floated='right' rounded />                                   
                                                        <p>Nome: {nome}</p>
                                                        <p>Categoria: {categoria}</p>
                                                        <Form.Input width={6} floated="left" type="number" label="Valor" name="valor" value={valor} onChange={this.onChange}/>
                                                        <Form.TextArea label="Descrição" name="descricao" value={descricao} onChange={this.onChange}/>
                                                        <br />
                                                    </Form>
                                                </Segment>
                                            )}
                                    </Grid.Column>
                                </Grid>
                            </Modal.Description>
                        )}
                        { tabCadastro && (
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
                        )}
                    </Responsive>
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