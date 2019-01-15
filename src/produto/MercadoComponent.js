import React from 'react';
import { Item, Icon, Image, Button, Container, Header } from 'semantic-ui-react';

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
            <Item.Group divided unstackable>
                {props.prods.map(p => (
                    <Item>
                        <Item.Content>
                        <Item.Image size='tiny' src={p.imagem} />
                            <Item.Header style={{ padding: 10 }}>
                                {p.nome}
                                <br />
                                <small>R$ {p.valor},00</small>
                            </Item.Header>
                            <Item.Description>
                                <p>{p.descricao}</p>   
                            </Item.Description>
                            <Item.Extra>
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
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Container>
    </div>
)