import React from 'react'
import { Button, Form, Container, Header, Segment, Message } from 'semantic-ui-react'
import { loginDistribuidor } from './api'

class LoginComponent extends React.Component {

    state = {
        nome: '',
        senha: '',
        msgError: null
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onLogin = () => {
        const { nome, senha } = this.state
        if (nome === '') {
            this.setState({ msgError: 'Preencher o campo de login.' })
        } else if (senha === '') {
            this.setState({ msgError: 'Preencher o campo de senha.' })
        } else {
            this.setState({ msgError: null })
            loginDistribuidor({
                nome,
                senha,
                categoria: 'distribuidor'
            }).then(res => {
                let usuario = res.data
                if (res.data.error) {
                    if (res.data.error === 'conta_invalid') this.setState({ msgError: 'Login ou senha incorreto' })
                    else if (res.data.error === 'conta_inactive') this.setState({ msgError: 'Sua conta está inativa' })
                    else this.setState({ msgError: 'Login ou senha incorreto' })
                } else if (usuario && usuario.distribuidor.codId) {
                    this.props.history.push('/distribuidor/' + usuario.distribuidor.codId + '/pedido');
                    this.setState({ msgError: null })
                }
            })
        }
    }

    render() {
        const { nome, senha, msgError } = this.state
        return(
            <Container style={{ paddingTop: 20 }}>
                <Header as='h2'>
                    Distribuidor
                </Header>
                <Segment>
                    <Form style={{ paddingTop: 20 }}>
                        <Form.Input width={16} label="Login" name="nome" value={nome} onChange={this.onChange}/>
                        <Form.Input type='password' width={16} label="Senha" name="senha" value={senha} onChange={this.onChange}/>
                    </Form>
                    { msgError && (
                        <Message info>
                            <Message.Header>{msgError}</Message.Header>
                        </Message>
                    )}     
                    <Button fluid primary onClick={this.onLogin} style={{ marginTop: 20 }}>Entrar</Button>
                </Segment>
            </Container>
        )
    }
}

export default LoginComponent