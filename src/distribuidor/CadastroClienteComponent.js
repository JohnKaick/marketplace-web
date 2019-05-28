import React from 'react'
import { Button, Form, Icon, Container, Grid, Header, Message, Image, Select } from 'semantic-ui-react'
import { create, update, get, upload } from './../cliente/api'
import { urlStorage } from './../app/api'

class ClienteModalCadastroComponent extends React.Component {
    
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
        msgError: null,
        imagemPath: null,
        image: null,
        file: null,
        distribuidorId: null,
        msgError: null
    }

    componentDidMount() {
        const { distribuidorId, clienteId } = this.props.match.params
        this.setState({ distribuidorId })
        if (clienteId) {
            get(clienteId).then(res => {
                const cliente = res.data
                this.setState({
                    ...cliente,
                    ...cliente.endereco,
                    id: cliente._id,
                    imagemPath: cliente.imagemPath ? `${urlStorage}/${cliente.imagemPath}` : null,
                })
            })
        }
    }

    onVoltar = () => {
        this.props.history.push('/admin/distribuidor');
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

    img = () => {
        const { image, imagemPath } = this.state
        if (image) {
            return <Image wrapped size='medium' src={image} />
        } else  if (imagemPath) {
            return <Image wrapped size='medium' src={imagemPath} />
        } else {
            return <Image wrapped size='medium' src='https://react.semantic-ui.com/images/wireframe/square-image.png' />
        }
    }

    render() {
        const { 
            nome, cpf, rg, email, celular, telefone, id, msgError,
            nomeEndereco, numero, complemento, bairro, cep, cidade, estado,
            distribuidores
        } = this.state
        return (
            <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={11}>
                        <Button primary onClick={this.onVoltar}>
                            <Icon name='angle left' /> Voltar
                        </Button>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Header as='h2'>
                            Novo Cliente
                        </Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Form style={{ paddingTop: 20}} onSubmit={this.onSalvar}>
                            <Header as='h3'>Dados pessoais</Header>
                            <Form.Input width={16} label="Nome completo" name="nome" value={nome} onChange={this.onChange}/>
                            <Form.Group>
                                <Form.Input width={5} label="CPF" name="cpf" value={cpf} onChange={this.onChange}/>
                                <Form.Input width={5} label="RG" name="rg" value={rg} onChange={this.onChange}/>
                                <Form.Input width={6} label="Email" name="email" value={email} onChange={this.onChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Input width={8} label="Telefone" name="telefone" value={telefone} onChange={this.onChange}/>                                
                                <Form.Input width={8} label="Celular" name="celular" value={celular} onChange={this.onChange}/>
                            </Form.Group>
                            <Header as='h3'>Endereço</Header>
                            <Form.Group>
                                <Form.Input width={10} label="Endereço" name="nomeEndereco" value={nomeEndereco} onChange={this.onChange}/>
                                <Form.Input width={2} label="Número" name="numero" value={numero} onChange={this.onChange}/>
                                <Form.Input width={4} label="Complemento" name="complemento" value={complemento} onChange={this.onChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Input width={6} label="Bairro" name="bairro" value={bairro} onChange={this.onChange}/>
                                <Form.Input width={3} label="CEP" name="cep" value={cep} onChange={this.onChange}/>
                                <Form.Input width={5} label="Cidade" name="cidade" value={cidade} onChange={this.onChange}/>
                                <Form.Input width={2} label="Estado" name="estado" value={estado} onChange={this.onChange}/>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={4} >
                        {this.img()}
                        {!id && (
                            <div>
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={this.onChangeImagem}
                                    ref={e => { this.fileInput = e }}/>
                                <Button attached='bottom' onClick={() => this.fileInput.click()}>Adicionar Foto Perfil</Button>
                            </div>
                        )}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column style={{ paddingBottom: 20 }} >
                        <Button primary type='submit' onClick={this.onSalvar}>
                            <Icon name='plus' /> Adicionar
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
        )
    }
}

export default ClienteModalCadastroComponent