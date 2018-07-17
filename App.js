import React from 'react';
import { StyleSheet, Alert, Text, View, TouchableOpacity, TouchableWithoutFeedback, TextInput, Image } from 'react-native';

getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const maxNumbers = {
  mafia: 3,
  players: 10
}

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      players: 10,
      mafia: 3,
      gameReady: false,
      showingCard: false,
      currentIndex: 0,
    }

    this.order = [];

    this.civilian = require('./img/civilian.png');
    this.commisar = require('./img/commisar.png');
    this.don = require('./img/don.png');
    this.mafia = require('./img/mafia.png');
  }

  _randomizeOrder = () => {
    const { mafia, players } = this.state;

    this.order = [];
    this.order.length = players;

    // Insert Don and Commisar
    this.order[this._getFreeRandomPosition()] = 'don';
    this.order[this._getFreeRandomPosition()] = 'commisar';

    // Insert Mafias
    for (let i = 0; i < mafia - 1; i++) {
      this.order[this._getFreeRandomPosition()] = 'mafia';
    }

    // Insert Civilians
    for (let i = 0; i < players - mafia - 1; i++) {
      this.order[this._getFreeRandomPosition()] = 'civilian';
    }

    this.setState({ gameReady: true });
  }

  _getFreeRandomPosition() {
    let position = getRandomNumberInRange(0, this.state.players - 1);

    while (this.order[position]) {
      position = getRandomNumberInRange(0, this.state.players - 1);
    }

    return position;
  }

  _changeValue = (key, event) => {
    let number = Number(event.nativeEvent.text);
    if (number > maxNumbers[key]) number = maxNumbers[key];

    this.setState({ [key]: number });
  }

  _viewCard = () => {
    this.setState({ showingCard: true });
  }

  _changeCard = () => {
    if (this.state.currentIndex === this.state.players - 1) {
      Alert.alert(
        'Done',
        'Last Card. Do you want to reset?',
        [
          { text: 'Yes', onPress: () => this.setState({gameReady: false, currentIndex: 0, showingCard: false}), style: 'cancel' },
          { text: 'No', onPress: () => {}, style: 'cancel' }
        ],
      )
    }
    else this.setState({ showingCard: false, currentIndex: this.state.currentIndex + 1 });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.prepareContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Players amount: </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={this.state.players.toString()}
              onChange={this._changeValue.bind(this, 'players')}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Mafias amount: </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={this.state.mafia.toString()}
              onChange={this._changeValue.bind(this, 'mafia')}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
          </View>

          <TouchableOpacity onPress={this._randomizeOrder}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Prepare Game</Text>
            </View>
          </TouchableOpacity>
        </View>

        {this.renderCards()}

      </View>
    );
  }

  renderCards() {
    if (!this.state.gameReady) return null;

    const card = (
      <TouchableWithoutFeedback style={styles.card} onPress={this._changeCard}>
        <View style={styles.card}>
          <Image
            style={styles.image}
            source={this[this.order[this.state.currentIndex] || 'don']}
          />
        </View>
      </TouchableWithoutFeedback>
    )

    const waitForAction = (
      <TouchableWithoutFeedback style={styles.card} onPress={this._viewCard}>
        <View style={styles.card}>
          <Text style={{ fontSize: 18 }}>Tap to view your role</Text>
        </View>
      </TouchableWithoutFeedback>
    );

    return this.state.showingCard ? card : waitForAction;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prepareContainer: {

  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: '50%',
    fontSize: 18,
  },
  input: {
    width: '50%',
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#eee'
  },
  button: {
    backgroundColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 20,
    marginHorizontal: 25,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  card: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    borderRadius: 4,
    borderWidth: 4,
    borderColor: 'black',
    width: 258,
    height: 360,
  }
});
