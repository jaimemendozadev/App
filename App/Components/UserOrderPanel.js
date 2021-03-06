import React, { Component } from "react";
import ActionButton from "react-native-circular-action-menu";
import Icon from "react-native-vector-icons/Foundation";
import Icon2 from "react-native-vector-icons/Entypo";
import moment from "moment";

import {
  View,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  RefreshControl,
  Image
} from "react-native";
import {
  Button,
  Text,
  Container,
  Content,
  Header,
  Left,
  Right,
  Card,
  CardItem,
  Body,
  Thumbnail
} from "native-base";
import Communications from "react-native-communications";
import { Actions } from "react-native-router-flux";
import axios from "axios";

export default class UserOrderPanel extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      order: null
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentWillMount() {
    let authID;

    async function getAuthID() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          data = JSON.parse(data);
          authID = data.userId;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getAuthID()
      .then(() => {
        axios
          .get("http://homemadeapp.org:3000/orders/" + authID)
          .then(orders => {
            console.log('orders are',orders)
            let order = orders.data[0];
            
            axios
              .get("http://homemadeapp.org:3000/user/" + order.chefId)
              .then(chefDetails => {
                this.setState({
                  order,
                  chefLocation: chefDetails.data[0].location,
                  phone: chefDetails.data[0].phoneNumber,
                  chefDetails: chefDetails.data[0]
                });
              });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  _onRefresh = () => {
    this.componentWillMount();
  }

  returnCart () {
    console.log(this.state.order.cart)
    let order;
    let dish = []
    for (var key in this.state.order.cart) {
     dish.push(this.state.order.cart[key]);
    }
    console.log(dish)
    return dish.map(order=>{
      return (
        <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
          <CardItem>
            <Thumbnail
              square
              large
              source={{ uri: order.dish.dishImages[0] }}
            />
            <Body>
              <Text>
                {order.dish.name}
              </Text>
              <Text note>
                Quantity: {order.amount}
              </Text>
            </Body>
          </CardItem>
        </Card>
    )
    })
    
    //  console.log(dish)

  }

  render() {
    const styles = {
      container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 70
      },
      userPic: {
        width: 200,
        height: 200,
        marginTop: -50,
        marginBottom: 50,
        borderRadius: 100
      },
      refreshText: {
        color: "#505050",
        fontFamily: "Noteworthy-Bold",
        fontSize: 17
      },
      infoText: {
        fontFamily: "Noteworthy-Bold",
        fontSize: 17
      },
      date: {
        color: "#9DDDE0",
        fontFamily: "MarkerFelt-Thin",
        fontSize: 24
      },
      orderStatus: {
        flexDirection: "row"
      },
      statusRed: {
        color: "#E05050",
        fontFamily: "Noteworthy-Bold",
        fontSize: 18
      },
      statusGreen: {
        color: "#6EE96E",
        fontFamily: "Noteworthy-Bold",
        fontSize: 18
      },
      button: {
        marginTop: 10
      },
      buttonText: {
        color: "#505050",
        fontFamily: "Noteworthy-Bold",
        fontSize: 16
      }
    };

    if (!this.state.order) {
      return (
        <View
          style={{
            marginTop: 100,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
            <Text>You have no current orders.</Text>
            <View style={{marginTop: 60, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <Button onPress={()=> { Actions.cuisines() }}><Text>Feeling Hungry?</Text></Button>
          </View>
        </View>
      );
    } else {
      return (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="black"
              colors={["#ff0000", "#00ff00", "#0000ff"]}
              progressBackgroundColor="#ffff00"
            />
          }
        >
        
          <Text style={styles.refreshText}>
            <Icon name="arrow-down" style={styles.refreshText} />
            {" "}
            Pull Down to Refresh
          </Text>

          <View style={{ alignItems: "center", marginTop: 100 }}>
            <Image
              style={styles.userPic}
              source={{
                uri: this.state.chefDetails.profileUrl
              }}
            />
            <Text style={styles.infoText}>
              Your order with {this.state.chefDetails.firstName}
            </Text>
            <Text style={styles.infoText}>was placed on:</Text>
            <Text style={styles.date}>
              {moment(this.state.order.date).format("LLLL")}
            </Text>
            <View style={styles.orderStatus}>
              <Text style={styles.infoText}>Order Status: </Text>
              {this.state.order.status === 0
                ? <Text style={styles.statusRed}>Pending</Text>
                : null}
              {this.state.order.status === 1
                ? <Text style={styles.statusGreen}>Accepted</Text>
                : null}
              {this.state.order.status === 2
                ? <Text style={styles.statusGreen}>Complete</Text>
                : null}
              {this.state.order.status === 3
                ? <Text style={styles.statusRed}>Canceled</Text>
                : null}
            </View>

            <View
              style={{
                flex: 0.2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {this.state.order.status === 1
                ? <View style={{ flex: 1 }}>
                    <Icon
                      name="telephone"
                      size={45}
                      style={{ alignSelf: "center", color: "black" }}
                      onPress={() =>
                        Communications.phonecall(this.state.phone, true)}
                    />
                  </View>
                : null}
              {this.state.order.status === 1
                ? <View style={{ flex: 1 }}>
                    <Icon2
                      name="message"
                      size={45}
                      style={{ alignSelf: "center", color: "black" }}
                      onPress={() => Communications.text(this.state.phone)}
                    />
                  </View>
                : null}
            </View>

            {this.state.order.status === 1
              ? <View style={{ flex: 0.2 }}>
                  <Button
                    rounded
                    transparent
                    bordered
                    dark
                    style={styles.buttons}
                    onPress={() => {
                      this.props.setChefLocationAndPhoneNumber(
                        this.state.chefLocation,
                        this.state.phone
                      );
                    }}
                  >
                    <Text style={styles.buttonText}>Get Directions</Text>
                  </Button>
                </View>
              : null}

            {this.state.order.status === 2
              ? <View style={{ flex: 0.6 }}>
                  <Button
                    rounded
                    transparent
                    bordered
                    dark
                    style={styles.buttons}
                    onPress={() =>
                      Actions.feedback(this.state.order, {
                        leavingChefReview: true
                      })}
                  >
                    <Text style={styles.buttonText}>Leave Feedback</Text>
                  </Button>
                </View>
              : <Text />}
              {/*{this.returnCart()}*/}
          </View>

        </ScrollView>
      );
    }
  }
}
