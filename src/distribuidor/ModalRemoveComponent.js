import React from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import { remove } from './api'

class ClienteModalRemoveComponent extends React.Component {
    
    state = {
        modalOpen: false,
        id: null,
        razaoSocial: ''
    }

    onOpen = () => {
        this.setState({ 
            modalOpen: true,
            ...this.props.distribuidor
        })
    }
    
    onClose = () => {
        this.setState({ modalOpen: false })
    }

    onRemove = () => {
        remove(this.state.id).then(() => {
            this.onClose()
            this.props.getDistribuidor()
        })
    }

    render() {
        return (
            <Modal
                trigger={this.props.children}
                open={this.state.modalOpen}
                onClose={this.onClose}
                onOpen={this.onOpen}
                basic 
                size='small'
            >
                <Header icon='archive' content='Desativar cliente' />
                <Modal.Content>
                <p>
                    Tem certeza que deseja desativar o distribuidor {this.state.razaoSocial}?
                </p>
                </Modal.Content>
                <Modal.Actions>
                <Button basic color='green' inverted onClick={this.onClose}>
                    <Icon name='remove' /> Não
                </Button>
                <Button color='red' inverted onClick={this.onRemove}>
                    <Icon name='checkmark' /> Sim
                </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ClienteModalRemoveComponent