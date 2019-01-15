import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Header, Button, Icon } from 'semantic-ui-react';

class ModalConfirmar extends React.Component {

    constructor(props) {
        super(props)
        this.close = this.close.bind(this)
        this.onOpen = this.onOpen.bind(this)
        this.state = {
            open: false,
        }
    }


    close() {
        this.setState({ open: false })
    }

    onOpen() {
        this.setState({ open: true })
    }

    render() {
        return(
            <Modal
                open={this.state.open}
                trigger={this.props.children}
                onOpen={this.onOpen}
                basic
                size='small' 
            >
                <Header icon='shopping cart' content='Produto adicionado no carrinho com sucesso.' />
                <Modal.Actions>
                    <Button basic color='blue' inverted onClick={this.props.onCarrinho}>
                        <Icon name='shopping cart' /> Ver carrinho
                    </Button>
                    <Button color='red' inverted onClick={this.close}>
                        <Icon name='remove' /> Fechar
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default withRouter(ModalConfirmar)