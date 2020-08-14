import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  View,
} from 'react-native';
import Card from './Card';
import EditCard from './EditCard';
import {ADMIN, ORUHELP} from '../constants/roles';

import {ThemeContext} from '../services/ThemeContext';
import {UserContext} from '../services/UserContext';
import {Icon} from 'react-native-elements';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import {name, trustName} from '../app.json';
import {sendPushNotification} from '../services/PushNotifications';

const Channel = props => {
  const theme = React.useContext(ThemeContext);
  const user = React.useContext(UserContext);
  const [channelData, setChannelData] = useState(props.channelData);
  const [modalVisible, setModalVisible] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeCard, setActiveCard] = useState({
    title: '',
    description: '',
  });
  const _channel = props.route && props.route.params;
  React.useEffect(() => {
    if (_channel.channel) {
      setInitialLoad(true);
      database()
        .ref(`orgs/${name.toLowerCase()}/channels/${_channel.channel}`)
        .on('value', snapshot => {
          const _val = snapshot.val();
          setChannelData(_val);
          setInitialLoad(false);
        });
    }
  }, [_channel.channel]);

  React.useEffect(() => {
    messaging()
      .subscribeToTopic(`${name.toLowerCase()}-${_channel.channel}`)
      .then(() =>
        console.log(
          'Subscribed to topic! - ' +
            `${name.toLowerCase()}-${_channel.channel}`,
        ),
      );
  }, []);

  const sendNotification = (_cardId, _description) => {
    sendPushNotification(`/topics/${name.toLowerCase()}-${_channel.channel}`, {
      title: trustName,
      body: _description,
      tag: name.toLowerCase(),
    });
    database()
        .ref(`orgs/${name.toLowerCase()}/channels/${_channel.channel}/${_cardId}/properties`)
        .set({"notificationsSent":true})
  };

  const isEditingEnabled = () => {
    if (_channel.custompage && _channel.custompage === ORUHELP) {
      return user.role === ORUHELP;
    }

    return user.role === ADMIN || user.role === ORUHELP;
  };

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      width: '100%',
      padding: 5,
      height: '85%',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      justifyContent: 'space-between',
      shadowOpacity: 0.25,
      shadowRadius: 13.84,
      elevation: 5,
    },
    openButton: {
      backgroundColor: '#F194FF',
      padding: 10,
      elevation: 2,
    },
    textStyle: {
      color: theme.palette.primary.dark,
      fontWeight: 'bold',
      textAlign: 'justify',
    },
    button: {
      marginBottom: 10,
      height: 50,
      backgroundColor: theme.palette.primary.dark,
      borderRadius: 0,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });

  const selectCard = _card => {
    setActiveCard({..._card});
    setEditMode(true);
    setModalVisible(true);
  };

  const updateCard = _cardData => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (_cardData) {
      database()
        .ref(
          `orgs/${name.toLowerCase()}/channels/${_channel.channel}/${
            _cardData.key
          }`,
        )
        .set(_cardData)
        .then(() => {
          setActiveCard({
            title: '',
            description: '',
          });
          setEditMode(false);
          setModalVisible(false);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setActiveCard({
            title: '',
            description: '',
          });
          Alert.alert('Could not update, please try again.');
        });
    } else {
      setLoading(false);
      Alert.alert('Some error, please try again');
    }
  };

  const deleteCard = _cardId => {
    if (loading) {
      return;
    }
    setLoading(true);
    const _index = channelData.order.findIndex(_obj => _obj === _cardId);
    if (
      _cardId &&
      _index !== -1 &&
      !(_index === 0 && channelData.order[0] !== _cardId)
    ) {
      let _tempArray = [...channelData.order];
      _tempArray.splice(_index, 1);
      database()
        .ref(`orgs/${name.toLowerCase()}/channels/${_channel.channel}/`)
        .update({
          [_cardId]: null,
          ['order/']: _tempArray,
        })
        .then(() => {
          setLoading(false);
        })
        .catch(_err => {
          setLoading(false);
          console.log(_err);
          Alert.alert('Some error, please try again');
        });
    } else {
      setLoading(false);
      Alert.alert('Some error, please try again');
    }
  };

  const moveUp = _cardId => {
    if (loading) {
      return;
    }
    setLoading(true);
    const _index = channelData.order.findIndex(_obj => _obj === _cardId);
    if (_index === 0) {
      Alert.alert('Cannot move further');
      setLoading(false);
    } else if (_cardId && _index !== -1 && _index !== 0) {
      let _tempArray = [...channelData.order];
      _tempArray.splice(_index - 1, 0, _tempArray.splice(_index, 1));
      database()
        .ref(`orgs/${name.toLowerCase()}/channels/${_channel.channel}/`)
        .update({
          ['order/']: _tempArray,
        })
        .then(() => {
          setLoading(false);
        })
        .catch(_err => {
          setLoading(false);
          console.log(_err);
          Alert.alert('Some error, please try again');
        });
    } else {
      setLoading(false);
      Alert.alert('Some error, please try again');
    }
  };

  const moveDown = _cardId => {
    if (loading) {
      return;
    }
    setLoading(true);
    const _index = channelData.order.findIndex(_obj => _obj === _cardId);
    if (_index === channelData.order.length - 1) {
      Alert.alert('Cannot move further');
      setLoading(false);
    } else if (_cardId && _index !== -1) {
      let _tempArray = [...channelData.order];
      _tempArray.splice(_index + 1, 0, _tempArray.splice(_index, 1));
      database()
        .ref(`orgs/${name.toLowerCase()}/channels/${_channel.channel}/`)
        .update({
          ['order/']: _tempArray,
        })
        .then(() => {
          setLoading(false);
        })
        .catch(_err => {
          setLoading(false);
          console.log(_err);
          Alert.alert('Some error, please try again');
        });
    } else {
      setLoading(false);
      Alert.alert('Some error, please try again');
    }
  };

  const addCard = _card => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (_card) {
      let _tempArray =
        channelData && channelData.order ? [...channelData.order] : [];
      if (_channel.reverse) {
        _tempArray.unshift(_card.key);
      } else {
        _tempArray.push(_card.key);
      }
      database()
        .ref(`orgs/${name.toLowerCase()}/channels/${_channel.channel}/`)
        .update({
          [_card.key]: _card,
          ['order/']: _tempArray,
        })
        .then(() => {
          setLoading(false);
          setActiveCard({
            title: '',
            description: '',
          });
          setModalVisible(false);
          setEditMode(false);
        })
        .catch(() => {
          setLoading(false);
          setActiveCard({
            title: '',
            description: '',
          });
          Alert.alert('Could not update, please try again.');
          setModalVisible(!modalVisible);
        });
    } else {
      Alert.alert('Please fill the required details...');
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color={theme.palette.primary.dark} />
      </View>
    );
  }
  return (
    <>
      {channelData && channelData.order && channelData.order.length > 0 ? (
        <ScrollView>
          <View style={{zIndex: 1}}>
            {channelData.order.map(_cardId => {
              if (
                channelData[_cardId] &&
                channelData[_cardId].components.order &&
                channelData[_cardId].components.order.length > 0
              ) {
                return (
                  <Card
                    cardId={_cardId}
                    {...channelData[_cardId]}
                    sendNotification={
                      channelData &&
                      channelData.properties &&
                      channelData.properties.notifications &&
                      ((channelData[_cardId].properties &&
                        channelData[_cardId].properties.notificationsSent &&
                        channelData[_cardId].properties.notificationsSent !==
                          true) ||
                        !channelData[_cardId].properties ||
                        !channelData[_cardId].properties.notificationsSent)
                        ? sendNotification
                        : undefined
                    }
                    enableEditing={isEditingEnabled()}
                    deleteCard={() => deleteCard(_cardId)}
                    moveUp={() => moveUp(_cardId)}
                    moveDown={() => moveDown(_cardId)}
                    editCard={() => selectCard(channelData[_cardId])}
                  />
                );
              }
            })}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: theme.palette.primary.dark,
              fontSize: 25,
              marginBottom: 20,
            }}>
            No Content
          </Text>
        </View>
      )}
      <View style={styles.centeredView}>
        {modalVisible && (
          <EditCard
            editMode={editMode}
            data={activeCard}
            addCard={addCard}
            loading={loading}
            updateCard={updateCard}
            onCancel={() => {
              setActiveCard({
                title: '',
                description: '',
              });
              setEditMode(false);
              setModalVisible(!modalVisible);
            }}
          />
        )}
      </View>
      {isEditingEnabled() && (
        <TouchableOpacity
          onPress={() => {
            setEditMode(false);
            setModalVisible(true);
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            position: 'absolute',
            bottom: 10,
            right: 10,
            height: 60,
            backgroundColor: theme.palette.primary.dark,
            borderRadius: 100,
            zIndex: 2,
          }}>
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );
};

export default Channel;
