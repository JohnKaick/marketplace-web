import React from 'react';
import { Card, Icon, Image, Button, Container, Header } from 'semantic-ui-react';

import ModalConfirmar from './ConfirmaComponent'
import imgCapa from '../img/capa_carrefour.jpg';

export default props => (
    <div>
        <br />
        <Container>
            <Header as='h2'>
                Carrefour
                <Button primary floated='right' onClick={() => props.onCarrinho()}>
                    <Icon name='shopping cart' /> Meu carrinho
                </Button>
            </Header>
        </Container>
        <br />
        <Image src={imgCapa} fluid />
        <br />
        <Container>
            <Header as='h3'>Produtos</Header>
            {props.prods.map(p => (
                <Card key={p.id}>
                    <Image src={p.imagem} />
                    <Card.Content>
                    <Card.Header>
                        {p.nome}
                        <small style={{ padding: 10 }}>R$ {p.valor},00</small>
                    </Card.Header>
                    <Card.Description>
                    <p>Descrição: {p.descricao}</p>                            
                    <div style={{ marginBottom: 10, float: 'right' }}>
                        <ModalConfirmar onCarrinho={props.onCarrinho} >
                            <Button circular color='blue' icon='shopping cart' onClick={() => props.onCadastrar(p)}> 
                                <Icon name='shopping cart' /> Add 
                            </Button>
                        </ModalConfirmar>
                    </div>
                    <Button.Group>
                        <Button basic color='blue' icon='minus' onClick={() => props.onMenos(p.id)}/>
                        <Button basic color='blue'>{p.quantidade}</Button>
                        <Button basic color='blue' icon='plus'onClick={() => props.onMais(p.id)}/>
                    </Button.Group>
                
                    </Card.Description>
                    </Card.Content>
                </Card>
            ))}
        </Container>
    </div>
)