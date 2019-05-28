import React from 'react'
import { Button, Form, Header, Container, Icon, Grid, Image, Select, Checkbox, Message } from 'semantic-ui-react'
import { create, update, get, upload, getConta } from './api'
import { getAllPagamento, getAllDistribuidor } from '../categoria/api'
import { urlStorage } from './../app/api'

class DistribuidorModalComponent extends React.Component {
    
    state = {
        id: null,
        contaId: null,
        pagamentoId: null,
        categoriaId: null,
        nome: '',
        razaoSocial: '',
        cnpj: '',
        telefone: '',
        login: null,
        senha: null,
        nomeEndereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cep: '',
        cidade: '',
        estado: '',
        nomeCompleto: '',
        cpf: '',
        rg: '',
        email: '',
        celular: '',
        pgNomeCompleto: '', 
        pgCpf: '',
        pgRg: '',
        pgEmail: '', 
        pgCelular: '',
        pgNomeEndereco: '',
        pgNumero:'',
        pgComplemento:'',
        pgCep:'',
        pgBairro:'',
        pgCidade:'',
        pgEstado:'',
        valor: null,
        pagamentos: [],
        pagamento: null,
        categorias: [],
        categoria: null,
        checked: true,
        msgError: null,
        imagemPath: null,
        image: null,
        file: null,
    }

    componentDidMount() {
        const { distribuidorId } = this.props.match.params
        if (distribuidorId) {
            get(distribuidorId).then(res => {
                const distribuidor = res.data                
                if (distribuidor.responsavel.nomeCompleto === distribuidor.dadosPagamento.responsavel.nomeCompleto) {
                    this.setState({
                        ...distribuidor,
                        ...distribuidor.responsavel,
                        ...distribuidor.endereco,
                        id: distribuidor._id,
                        pagamentoId: distribuidor.dadosPagamento.categoria._id,
                        valor: distribuidor.dadosPagamento.valor,
                        categoriaId: distribuidor.categoria._id,
                    })
                } else {
                    this.setState({
                        ...distribuidor,
                        ...distribuidor.responsavel,
                        ...distribuidor.endereco,
                        id: distribuidor._id,
                        pagamentoId: distribuidor.dadosPagamento.categoria._id,
                        valor: distribuidor.dadosPagamento.valor,
                        categoriaId: distribuidor.categoria._id,
                        pgNomeCompleto:  distribuidor.dadosPagamento.responsavel.nomeCompleto, 
                        pgCpf:  distribuidor.dadosPagamento.responsavel.cpf, 
                        pgRg:  distribuidor.dadosPagamento.responsavel.rg, 
                        pgEmail:  distribuidor.dadosPagamento.responsavel.email, 
                        pgCelular:  distribuidor.dadosPagamento.responsavel.celular,
                        pgNomeEndereco:  distribuidor.dadosPagamento.endereco.nomeEndereco, 
                        pgNumero: distribuidor.dadosPagamento.endereco.numeto, 
                        pgComplemento: distribuidor.dadosPagamento.endereco.complemento, 
                        pgCep: distribuidor.dadosPagamento.endereco.cep, 
                        pgBairro: distribuidor.dadosPagamento.endereco.bairro,
                        pgCidade: distribuidor.dadosPagamento.endereco.cidade,
                        pgEstado: distribuidor.dadosPagamento.endereco.estado,
                        checked: false,
                    })      
                }
                return getConta(distribuidorId)                          
            }).then(res => {
                const conta = res.data
                this.setState({
                    login: conta.login,
                    senha: conta.senha,
                    contaId: conta._id
                })
            })
        }
        getAllPagamento().then(res => {
            this.setState({ pagamentos: res.data })
        })
        getAllDistribuidor().then(res => {
            this.setState({ categorias: res.data })
        })
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

    toggle = () => {
        this.setState({ checked: !this.state.checked })
    }

    onPagamentoSelected = (e, { value }) => {
        this.setState({
            pagamento: value
        })
    }

    onDistribuidorSelected = (e, { value }) => {
        this.setState({
            categoria: value
        })
    }

    onSalvar = () => {
        const { 
            nome, razaoSocial, cnpj, telefone, 
            nomeCompleto, cpf, rg, email, celular,
            nomeEndereco, numero, complemento, cep, bairro, cidade, estado,
            pgNomeCompleto, pgCpf, pgRg, pgEmail, pgCelular,
            pgNomeEndereco, pgNumero, pgComplemento, pgCep, pgBairro, pgCidade, pgEstado,
            pagamento, categoria, id, checked, file, pagamentoId, categoriaId,
            login, senha, valor, contaId,
        } = this.state
        let pgDados = null
        if (checked) {
            pgDados = {
                endereco: {
                    nomeEndereco, 
                    numero, 
                    complemento, 
                    cep, 
                    bairro, 
                    cidade,
                    estado,
                },
                responsavel: {
                    nomeCompleto,
                    cpf,
                    rg,
                    email,
                    celular
                }
            }
        } else {
            pgDados = {
                endereco: {
                    nomeEndereco: pgNomeEndereco,
                    numero: pgNumero,
                    complemento: pgComplemento,
                    cep: pgCep,
                    bairro: pgBairro,
                    cidade: pgCidade,
                    estado: pgEstado
                },
                responsavel: {
                    nomeCompleto: pgNomeCompleto,
                    cpf: pgCpf,
                    rg: pgRg,
                    email: pgEmail,
                    celular: pgCelular
                }
            }
        }
        if (!pagamento && !pagamentoId) {
            this.setState({ msgError: 'Por favor, selecione o modelo de pagamento.' })
        } else if (!categoria && !categoriaId) {
            this.setState({ msgError: 'Por favor, selecione a categoria.' })
        } else {
            if (id) {
                update({
                    nome, razaoSocial, cnpj, telefone, id,
                    nomeCompleto, cpf, rg, email, celular,
                    nomeEndereco, numero, complemento, cep, bairro, cidade, estado,
                    pagamentoId: pagamento ? pagamento : pagamentoId,
                    categoriaId: categoria ? categoria : categoriaId,
                    login, senha, pgDados, valor, contaId,
                }).then(() => {
                    this.onVoltar()
                })
            } else {
                create({
                    nome, razaoSocial, cnpj, telefone,
                    nomeCompleto, cpf, rg, email, celular,
                    nomeEndereco, numero, complemento, cep, bairro, cidade, estado,
                    pagamentoId: pagamento ? pagamento : pagamentoId,
                    categoriaId: categoria ? categoria : categoriaId,
                    login: login ? login : nome,
                    senha: senha ? senha : nome,
                    pgDados, valor,
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
    }

    img = () => {
        const { image, imagemPath } = this.state
        if (image) {
            return <Image wrapped size='medium' src={image} />
        } else  if (imagemPath) {
            return <Image wrapped size='medium' src={`${urlStorage}/${imagemPath}`} />
        } else {
            return <Image wrapped size='medium' src='https://react.semantic-ui.com/images/wireframe/square-image.png' />
        }
    }

    render() {
        const { 
            nome, razaoSocial, cnpj, telefone, categorias, categoria,
            nomeCompleto, cpf, rg, email, celular,
            nomeEndereco, numero, complemento, cep, bairro, cidade, estado,
            pgNomeCompleto, pgCpf, pgRg, pgEmail, pgCelular,
            pgNomeEndereco, pgNumero, pgComplemento, pgCep, pgBairro, pgCidade, pgEstado,
            pagamentos, pagamento, msgError, id, login, senha, valor
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
                                Novo distribuidor
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <Form style={{ paddingTop: 20}} onSubmit={this.onSalvar}>
                                <Header as='h3'>Empresa</Header>
                                <Form.Group>
                                    <Form.Input width={10} label="Nome" name="nome" value={nome} onChange={this.onChange}/>
                                    <Form.Field
                                        width={6}
                                        control={Select}
                                        label='Categoria'
                                        name='categoria'
                                        options={categorias.map(cat => {
                                            return { key: cat._id, text: cat.nome, value: cat._id }
                                        })}
                                        onChange={this.onDistribuidorSelected}
                                        required
                                    />
                                </Form.Group>
                                <Form.Input width={16} label="Razão Social" name="razaoSocial" value={razaoSocial} onChange={this.onChange}/>
                                <Form.Group>
                                    <Form.Input width={8} label="CNPJ" name="cnpj" value={cnpj} onChange={this.onChange}/>
                                    <Form.Input width={8} label="Telefone" name="telefone" value={telefone} onChange={this.onChange}/>
                                </Form.Group>
                                <Header as='h3'>Acesso</Header>
                                <Form.Group>
                                    <Form.Input width={8} label="Login" name="login" value={login} onChange={this.onChange}/>
                                    <Form.Input width={8} label="Senha" name="senha" value={senha} onChange={this.onChange}/>
                                </Form.Group>
                                <Header as='h3'>Responsável</Header>
                                <Form.Group>
                                    <Form.Input width={11} label="Nome completo" name="nomeCompleto" value={nomeCompleto} onChange={this.onChange}/>
                                    <Form.Input width={5} label="CPF" name="cpf" value={cpf} onChange={this.onChange}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Input width={5} label="RG" name="rg" value={rg} onChange={this.onChange}/>
                                    <Form.Input width={6} label="Email" name="email" value={email} onChange={this.onChange}/>
                                    <Form.Input width={5} label="Celular" name="celular" value={celular} onChange={this.onChange}/>
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
                                <Header as='h3'>Pagamento</Header>
                                <Form.Group>
                                    <Form.Field
                                        width={8}
                                        control={Select}
                                        label='Modelo de pagamento'
                                        name='pagamento'
                                        options={pagamentos.map(pg => {
                                            return { key: pg._id, text: pg.nome, value: pg._id }
                                        })}
                                        onChange={this.onPagamentoSelected}
                                        required
                                    />
                                    <Form.Input type="number" width={8} label="Valor" name="valor" value={valor} onChange={this.onChange}/>
                                </Form.Group>
                                <Checkbox label='Os dados de cobrança são os mesmos do responsável e endereço acima?' onChange={this.toggle} checked={this.state.checked} />
                                {!this.state.checked && (
                                    <div style={{ paddingTop: 10 }}>
                                        <Form.Group>
                                            <Form.Input width={11} label="Nome completo" name="pgNomeCompleto" value={pgNomeCompleto} onChange={this.onChange}/>
                                            <Form.Input width={5} label="CPF" name="pgCpf" value={pgCpf} onChange={this.onChange}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Input width={5} label="RG" name="pgRg" value={pgRg} onChange={this.onChange}/>
                                            <Form.Input width={6} label="Email" name="pgEmail" value={pgEmail} onChange={this.onChange}/>
                                            <Form.Input width={5} label="Celular" name="pgCelular" value={pgCelular} onChange={this.onChange}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Input width={10} label="Endereço" name="pgNomeEndereco" value={pgNomeEndereco} onChange={this.onChange}/>
                                            <Form.Input width={2} label="Número" name="pgNumero" value={pgNumero} onChange={this.onChange}/>
                                            <Form.Input width={4} label="Complemento" name="pgComplemento" value={pgComplemento} onChange={this.onChange}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Input width={6} label="Bairro" name="pgBairro" value={pgBairro} onChange={this.onChange}/>
                                            <Form.Input width={3} label="CEP" name="pgCep" value={pgCep} onChange={this.onChange}/>
                                            <Form.Input width={5} label="Cidade" name="pgCidade" value={pgCidade} onChange={this.onChange}/>
                                            <Form.Input width={2} label="Estado" name="pgEstado" value={pgEstado} onChange={this.onChange}/>
                                        </Form.Group>
                                    </div>
                                )}
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
                                    <Button attached='bottom' onClick={() => this.fileInput.click()}>Adicionar Capa</Button>
                                </div>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column style={{ paddingBottom: 20 }} >
                            <Button primary type='submit' onClick={this.onSalvar}>
                                <Icon name='plus' /> Adicionar
                            </Button>
                            { msgError && (
                                <Message floated='left' compact warning>
                                    {msgError}
                                </Message>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default DistribuidorModalComponent