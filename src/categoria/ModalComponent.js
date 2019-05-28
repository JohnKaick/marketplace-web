import React from 'react'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import { 
    addProduto, addDistribuidor, addPagamento,
    editProduto, editDistribuidor, editPagamento,
    delProduto, delDistribuidor, delPagamento,
} from './api'


class CategoriaModalComponent extends React.Component {
    
    state = {
        modalOpen: false,
        id: null,
        nome: '',
    }

    onOpen = () => {
        this.setState({ 
            modalOpen: true, 
            id: this.props._id,
            nome: this.props.nome
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

    onSalvar = () => {
        const { nome, id } = this.state
        const { tipo } = this.props

        if (id) {
            if (tipo === 'produto') {
                editProduto({
                    id,
                    nome
                }).then(() => {
                    this.onClose()
                    this.props.get()
                })
            } else if (tipo === 'distribuidor') {
                editDistribuidor({
                    id,
                    nome
                }).then(() => {
                    this.onClose()
                    this.props.get()
                })
            } else if (tipo === 'pagamento') {
                editPagamento({
                    id,
                    nome
                }).then(() => {
                    this.onClose()
                    this.props.get()
                })
            }
        } else {
            if (tipo === 'produto') {
                addProduto({
                    nome
                }).then(() => {
                    this.onClose()
                    this.props.get()
                })
            } else if (tipo === 'distribuidor') {
                addDistribuidor({
                    nome
                }).then(() => {
                    this.onClose()
                    this.props.get()
                })
            } else if (tipo === 'pagamento') {
                addPagamento({
                    nome
                }).then(() => {
                    this.onClose()
                    this.props.get()
                })
            }
        }
    }

    onRemover = () => {
        const { id } = this.state
        const { tipo } = this.props
        if (tipo === 'produto') {
            delProduto(id).then(() => {
                this.onClose()
                this.props.get()
            })
        } else if (tipo === 'distribuidor') {
            delDistribuidor(id).then(() => {
                this.onClose()
                this.props.get()
            })
        } else if (tipo === 'pagamento') {
            delPagamento(id).then(() => {
                this.onClose()
                this.props.get()
            })
        }
    }

    render() {
        return (
            <Modal
                trigger={this.props.children}
                open={this.state.modalOpen}
                onClose={this.onClose}
                onOpen={this.onOpen}
                size="tiny"
            >
                <Icon link size='large' name='cancel' style={{ float: 'right', margin: '10px' }} onClick={this.onClose}/>
                <Modal.Header>
                    { this.props.tipo === 'produto' && ("Categoria Produto") }
                    { this.props.tipo === 'distribuidor' && ("Categoria Distribuidor") }
                    { this.props.tipo === 'pagamento' && ("Categoria Pagamento") }
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.onSalvar}>
                        <Form.Input label="Nome" name="nome" value={this.state.nome} onChange={this.onChange}/>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    { this.state.id && (
                        <Button color="red" floated="left" onClick={this.onRemover}>
                            <Icon name="trash" />
                            Excluir
                        </Button>
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

export default CategoriaModalComponent