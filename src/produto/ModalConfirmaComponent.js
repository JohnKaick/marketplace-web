import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Header, Button, Icon, Form } from 'semantic-ui-react';
import { addCarrinho } from '../carrinho/api';

class ModalConfirmar extends React.Component {

    state = {
        open: false,
        observacao: ''
    }

    close = () => {
        this.setState({ open: false })
    }

    onOpen = () => {
        this.setState({ open: true })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onCadastrar = () => {
        addCarrinho(this.props.produto, this.props.distribuidorId, this.props.clienteId, this.state.observacao).then(() => {
            this.close()
            this.props.onQtsDefault()
            this.props.onCarrinho()
        })
    }

    render() {
        return(
            <Modal
                open={this.state.open}
                trigger={this.props.children}
                onOpen={this.onOpen}
                size='small' 
            >
                <Header icon='shopping cart' content='Observação' />
                <Modal.Content>
                    <Form>
                        <Form.TextArea label="Deseja escrever alguma observação ao pedido do seu produto?" name="observacao" value={this.state.observacao} onChange={this.onChange}/>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close}>
                        <Icon name='arrow left' /> Voltar
                    </Button>
                    <Button primary onClick={this.onCadastrar}>
                        <Icon name='shopping cart' /> Adicionar
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default withRouter(ModalConfirmar)