import React from 'react';
import { Container, Table, Grid, Header, Button } from 'semantic-ui-react'
import ModalComponent from './ModalComponent'
import { getAllProduto, getAllDistribuidor, getAllPagamento } from './api'

class CategoriaComponent extends React.Component {
    
    state = {
        produtos: null,
        distribuidores: null,
        pagamentos: null,
    }

    componentDidMount() {
        this.get()
    }

    get = () => {
        getAllProduto().then(res => {
            this.setState({ produtos: res.data })
        })
        getAllDistribuidor().then(res => {
            this.setState({ distribuidores: res.data })
        })
        getAllPagamento().then(res => {
            this.setState({ pagamentos: res.data })
        })
    }

    render() {
        
        const { produtos, distribuidores, pagamentos } = this.state

        return(
            <Container>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>Categorias</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Table selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            <small style={{ fontSize: 20 }}>Produto</small>
                                            <ModalComponent tipo="produto" get={this.get}>
                                                <Button circular primary floated='right' icon='plus' />
                                            </ModalComponent>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {(produtos || []).map((p, i) => (
                                        <ModalComponent tipo="produto" get={this.get} {...p}>
                                            <Table.Row key={i} style={{ cursor: 'pointer' }}>
                                                <Table.Cell>{p.nome}</Table.Cell>
                                            </Table.Row>
                                        </ModalComponent>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                        <Grid.Column>
                            <Table selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            <small style={{ fontSize: 20 }}>Distribuidor</small>
                                            <ModalComponent tipo="distribuidor" get={this.get}>
                                                <Button circular primary floated='right' icon='plus' />
                                            </ModalComponent>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {(distribuidores || []).map((d, i) => (
                                        <ModalComponent tipo="distribuidor" get={this.get} {...d}>
                                            <Table.Row key={i} style={{ cursor: 'pointer' }}>
                                                <Table.Cell>{d.nome}</Table.Cell>
                                            </Table.Row>
                                        </ModalComponent>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                        <Grid.Column>
                            <Table selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            <small style={{ fontSize: 20 }}>Pagamento</small>
                                            <ModalComponent tipo="pagamento" get={this.get}>
                                                <Button circular primary floated='right' icon='plus' />                                            
                                            </ModalComponent>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {(pagamentos || []).map((p, i) => (
                                        <ModalComponent tipo="pagamento" get={this.get} {...p}>
                                            <Table.Row key={i} style={{ cursor: 'pointer' }}>
                                                <Table.Cell>{p.nome}</Table.Cell>
                                            </Table.Row>
                                        </ModalComponent>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default CategoriaComponent