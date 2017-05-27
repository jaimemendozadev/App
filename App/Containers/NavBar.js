import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Container, Content, List, ListItem, Thumbnail, Text, Body, Left, Right } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class NavBar extends Component {

  cuisines() {
    Actions.cuisines({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  chefList() {
    Actions.chefList({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  profile() {
    Actions.profile({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }
  chefMap() {
    Actions.chefMap({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  checkout() {
    Actions.checkout({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }
  
  edit() {
    Actions.edit({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }
  orders() {
    Actions.orders({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  logout() {
    Actions.homepage({type:ActionConst.RESET});
    async function clearStorage() {
      try {
        await AsyncStorage.multiRemove(['profile', 'token', 'isAuthenticated'], () => {
          console.log('Storage cleared!');
        })
      } catch (err) {
        console.log('Error clearing storage: ', err);
      }
    }
    clearStorage();
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  render() {
    return (
      <Container style={styles.actionButtonIcon}>
        <Content style={{ marginTop: 20 }}>
          <ListItem avatar onPress={this.cuisines}>
            <Body>
                <Text>Cuisines</Text>
            </Body>
            <Right>
              <Text note>🍕</Text>
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.chefList}>
            <Body>
              <Text>List of Chefs</Text>
            </Body>
            <Right>
              <Text note></Text>
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.profile}>
            <Body>
              <Text>Profile</Text>
            </Body>
            <Right>
              <Text note></Text>
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.chefMap}>
            <Body>
              <Text>Map</Text>
            </Body>
            <Right>
              <Text note></Text>
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.checkout}>
            <Body>
              <Text>Checkout</Text>
            </Body>
            <Right>
              <Text note></Text>
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.edit}>
            <Body>
              <Text>Edit Profile</Text>
            </Body>
            <Right>
              <Text note></Text>
            </Right>
          </ListItem>
           <ListItem avatar onPress={this.orders}>
            <Body>
              <Text>Orders</Text>
            </Body>
            <Right>
              <Text note></Text>
            </Right>
          </ListItem>

          <ListItem avatar onPress={this.logout}>

            <Body>
              <Text>Log Out</Text>
            </Body>
            <Right>
              <Text note>LO</Text>
            </Right>
          </ListItem>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
