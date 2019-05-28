import React from 'react'
import { Button, Container, Grid, Header} from 'semantic-ui-react'
import { get, remove } from './../cliente/api'

class ClienteModalCadastroMobileComponent extends React.Component {
    
    state = {
        id: null,
        distribuidorId: null,
        codId: null,
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        telefone: '',
        celular: '',
        endereco: {},
    }

    componentDidMount() {
        const { distribuidorId, clienteId } = this.props.match.params
        this.setState({ distribuidorId })
        if (clienteId) {
            get(clienteId).then(res => {
                const cliente = res.data
                this.setState({
                    ...cliente,
                    endereco: {...cliente.endereco},
                    id: cliente._id,
                })
            })
        }
    }

    onVoltar = () => {
        const { distribuidorId } = this.state
        this.props.history.push(`/distribuidor/${distribuidorId}/pedido`);
    }

    onEditar = () => {
        const { distribuidorId, id } = this.state
        this.props.history.push(`/distribuidor/${distribuidorId}/editar/cliente/${id}`);
    }

    onDesativar = () => {
        remove(this.state.id).then(res => {
            this.onVoltar()
        })
    }

    render() {
        const { 
            nome, cpf, rg, email, celular, telefone,
            endereco, codId,
        } = this.state
        return (
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h2' style={{ padding: 10 }}>
                                <Button circular primary size='medium' floated='left' icon='angle left' onClick={this.onVoltar} />
                                Cliente
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                        <p>Nome: {nome}</p>
                        <p>Código: {codId}</p>
                        <p>CPF: {cpf}</p>
                        <p>RG: {rg}</p>
                        <p>E-mail: {email}</p>
                        <p>Telefone: {telefone}</p>
                        <p>Celular: {celular}</p>
                        <p>Endereço: {endereco.nomeEndereco}</p>
                        <p>Número: {endereco.numero}</p>
                        <p>Complemento: {endereco.complemento}</p>
                        <p>Bairro: {endereco.bairro}</p>
                        <p>CEP: {endereco.cep}</p>
                        <p>Cidade: {endereco.cidade}</p>
                        <p>Estado: {endereco.estado}</p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid primary onClick={() => this.onEditar()}>Editar</Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button fluid danger onClick={() => this.onDesativar()}>Desativar</Button>
                        </Grid.Column>
                    </Grid.Row>                            
                </Grid>
            </Container>
        )
    }
}

export default ClienteModalCadastroMobileComponent