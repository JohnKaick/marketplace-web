import React from 'react'
import { Button, Form, Icon, Container, Grid, Header, Message, Image, Select } from 'semantic-ui-react'
import { create, update, get, upload } from './../cliente/api'
import { getOneCodId } from './../distribuidor/api'
import { urlStorage } from './../app/api'

class ClienteModalCadastroMobileComponent extends React.Component {
    
    state = {
        modalOpen: false,
        id: null,
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        telefone: '',
        celular: '',
        nomeEndereco: '',
        numero: null,
        complemento: '',
        bairro: '',
        cep: '',
        cidade: '',
        estado: '',
        imagemPath: null,
        image: null,
        file: null,
        distribuidorCodId: null,
        distribuidorId: null,
    }

    componentDidMount() {
        const { distribuidorId, clienteId } = this.props.match.params
        this.setState({ distribuidorCodId: distribuidorId })
        if (clienteId) {
            get(clienteId).then(res => {
                const cliente = res.data
                this.setState({
                    ...cliente,
                    ...cliente.endereco,
                    id: cliente._id,
                    imagemPath: cliente.imagemPath ? `${urlStorage}/${cliente.imagemPath}` : null,
                    distribuidorId: cliente.distribuidor._id
                })
            })
        }
        getOneCodId(distribuidorId).then(res => {
            this.setState({
                distribuidorId: res.data._id
            })
        })
    }

    onVoltar = () => {
        const { distribuidorCodId } = this.state
        this.props.history.push(`/distribuidor/${distribuidorCodId}/pedido`);
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
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
        const { 
            id, nome, cpf, rg, email, telefone, celular,
            nomeEndereco, numero, complemento, bairro, cep, cidade, estado,
            file, distribuidorId
        } = this.state

        if (id) {
            update({
                distribuidorId,
                id,
                nome,
                cpf,
                rg,                
                email,
                telefone,
                celular,
                endereco: {
                    nomeEndereco, 
                    numero, 
                    complemento, 
                    cep, 
                    bairro, 
                    cidade,
                    estado,
                },
            }).then(() => {
                this.onVoltar()
            })
        } else {
            create({
                distribuidorId,
                nome,
                cpf,
                rg,                
                email,
                telefone,
                celular,
                endereco: {
                    nomeEndereco, 
                    numero, 
                    complemento, 
                    cep, 
                    bairro, 
                    cidade,
                    estado,
                },
            }).then(res => {
                if (file) {
                    const data = new FormData() 
                    data.append('file', file)
                    return upload(data, res.data)
                } else {
                    return null
                }
            }).then(() => {
                this.onVoltar()
            })
        }
    }

    render() {
        const { 
            nome, cpf, rg, email, celular, telefone,
            nomeEndereco, numero, complemento, bairro, cep, cidade, estado, imagemPath
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
                    <Form style={{ paddingTop: 20 }}>
                        <Grid.Row>
                            <Grid.Column width={4} >
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={this.onChangeImagem}
                                    ref={e => { this.fileInput = e }}/>
                                <Button primary onClick={() => this.fileInput.click()}>Adicionar foto</Button>
                                <Image wrapped size='medium' src={ imagemPath ? imagemPath : 'https://react.semantic-ui.com/images/wireframe/square-image.png'} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{ paddingTop: 20 }}>
                            <Grid.Column>
                                    <Header as='h4'>Dados pessoais</Header>
                                    <Form.Input label="Nome completo" name="nome" value={nome} onChange={this.onChange}/>
                                    <Form.Input label="CPF" name="cpf" value={cpf} onChange={this.onChange}/>
                                    <Form.Input label="RG" name="rg" value={rg} onChange={this.onChange}/>
                                    <Form.Input label="Email" name="email" value={email} onChange={this.onChange}/>
                                    <Form.Input label="Telefone" name="telefone" value={telefone} onChange={this.onChange}/>                                
                                    <Form.Input label="Celular" name="celular" value={celular} onChange={this.onChange}/>
                                    <Header as='h4'>Endereço</Header>
                                    <Form.Input label="Endereço" name="nomeEndereco" value={nomeEndereco} onChange={this.onChange}/>
                                    <Form.Input label="Número" name="numero" value={numero} onChange={this.onChange}/>
                                    <Form.Input label="Complemento" name="complemento" value={complemento} onChange={this.onChange}/>
                                    <Form.Input label="Bairro" name="bairro" value={bairro} onChange={this.onChange}/>
                                    <Form.Input label="CEP" name="cep" value={cep} onChange={this.onChange}/>
                                    <Form.Input label="Cidade" name="cidade" value={cidade} onChange={this.onChange}/>
                                    <Form.Input label="Estado" name="estado" value={estado} onChange={this.onChange}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Form>
                    <Grid.Row>
                        <Grid.Column style={{ paddingBottom: 20 }} >
                            <Button primary type='submit' onClick={this.onSalvar}>
                                <Icon name='plus' /> Salvar
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default ClienteModalCadastroMobileComponent