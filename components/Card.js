import React from 'react';
import {View, Linking, TouchableHighlight} from 'react-native';
import Images from '../components/Images';
import {Icon} from 'react-native-elements';
import {Button, ListItem} from 'react-native-elements';
import Markdown from 'react-native-markdown-display';
import {ThemeContext} from '../services/ThemeContext';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const Card = props => {
  const theme = React.useContext(ThemeContext);

  const markdownStyles = {
    body: {
      color: theme.palette.primary.dark,
      fontSize: props.fontSize ? props.fontSize : 15,
    },
  };

  const styles = {
    margin: {
      padding: 10,
    },
    listContainer: {
      borderLeftWidth: props.unread ? 3 : 0,
      borderColor: theme.palette.primary.dark,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      color: theme.palette.primary.dark,
    },
    body: {
      color: theme.palette.primary.dark,
      fontSize: props.fontSize ? props.fontSize : 15,
    },
    buttonContainer: {
      fontSize: 30,
      margin: 10,
      marginTop: 5,
    },
    buttonTitle: {
      color: theme.palette.primary.dark,
    },
    menuText: {
      fontSize: 20,
      margin: 5,
      color: theme.palette.primary.dark,
    },
  };

  const getComponent = _component => {
    switch (_component.type) {
      case 'markdown':
        return _component.value ? (
          <Markdown style={markdownStyles}>
            {_component.value.replace(/\\n/g, '\n')}
          </Markdown>
        ) : null;
      case 'button':
        return (
          <Button
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonTitle}
            buttonStyle={{
              borderColor: theme.palette.primary.dark,
            }}
            color={theme.palette.primary.dark}
            type="outline"
            icon={
              <Icon
                name={_component.value.icon && _component.value.icon.name}
                type={
                  _component.value.icon && _component.value.icon.type
                    ? _component.value.icon.type
                    : 'material'
                }
                color={theme.palette.primary.dark}
                iconStyle={{
                  marginRight:
                    _component.value.icon && _component.value.icon.name
                      ? 25
                      : 0,
                }}
              />
            }
            title={_component.value.name}
            onPress={() =>
              _component.value.onPress.uri &&
              Linking.openURL(_component.value.onPress.uri)
            }
          />
        );
      case 'images':
        return _component.value && <Images images={_component.value} />;
      default:
        return;
    }
  };
  const sendNotification = () => {
    if (
      props.components &&
      props.components.order &&
      props.components.order.length > 0
    ) {
      props.sendNotification(
        props.components[props.components.order[0]].value.toString(),
      );
    } else {
      props.sendNotification('New Item added');
    }
  };
  return (
    <View style={{position: 'relative'}}>
      <TouchableHighlight underlayColor="none" style={styles.margin}>
        <ListItem
          contentContainerStyle={styles.contentContainer}
          containerStyle={styles.listContainer}
          title={props.title}
          onLongPress={props.onLongPress}
          titleStyle={props.title ? styles.title : {...styles.title, height: 0}}
          subtitle={
            <View>
              {props.components &&
                props.components.order &&
                props.components.order.length > 0 &&
                props.components.order.map(_componentId => {
                  if (props.components[_componentId]) {
                    const _component = props.components[_componentId];
                    return getComponent(_component);
                  }
                })}
            </View>
          }
          onPress={props.onPress}
        />
      </TouchableHighlight>
      {props.enableEditing && (
        <View style={{position: 'absolute', top: 20, right: 20}}>
          <Menu>
            <MenuTrigger>
              <Icon
                containerStyle={{alignSelf: 'flex-start'}}
                type="material"
                color="#C8C8C8"
                name="more-vert"
              />
            </MenuTrigger>
            <MenuOptions>
              {props.sendNotification && (
                <MenuOption>
                  <Button
                    onPress={sendNotification}
                    color={theme.palette.primary.dark}
                    titleStyle={{color: theme.palette.primary.dark}}
                    type="clear"
                    title="Send Notification"
                    icon={
                      <Icon
                        name="notifications"
                        color={theme.palette.primary.dark}
                        iconStyle={{
                          marginRight: 25,
                        }}
                      />
                    }
                  />
                </MenuOption>
              )}

              <MenuOption>
                <Button
                  onPress={props.moveUp}
                  color={theme.palette.primary.dark}
                  titleStyle={{color: theme.palette.primary.dark}}
                  type="clear"
                  title="Move Up"
                  icon={
                    <Icon
                      name="arrow-upward"
                      color={theme.palette.primary.dark}
                      iconStyle={{
                        marginRight: 25,
                      }}
                    />
                  }
                />
              </MenuOption>
              <MenuOption>
                <Button
                  onPress={props.moveDown}
                  color={theme.palette.primary.dark}
                  titleStyle={{color: theme.palette.primary.dark}}
                  type="clear"
                  title="Move Down"
                  icon={
                    <Icon
                      name="arrow-downward"
                      color={theme.palette.primary.dark}
                      iconStyle={{
                        marginRight: 25,
                      }}
                    />
                  }
                />
              </MenuOption>
              <MenuOption onSelect={props.editCard}>
                <Button
                  onPress={props.editCard}
                  color={theme.palette.primary.dark}
                  titleStyle={{color: theme.palette.primary.dark}}
                  type="clear"
                  title="Edit"
                  icon={
                    <Icon
                      name="create"
                      color={theme.palette.primary.dark}
                      iconStyle={{
                        marginRight: 25,
                      }}
                    />
                  }
                />
              </MenuOption>
              <MenuOption onSelect={props.deleteCard}>
                <Button
                  onPress={props.deleteCard}
                  color={theme.palette.primary.dark}
                  titleStyle={{color: theme.palette.primary.dark}}
                  type="clear"
                  title="Delete"
                  icon={
                    <Icon
                      name="delete"
                      color={theme.palette.primary.dark}
                      iconStyle={{
                        marginRight: 25,
                      }}
                    />
                  }
                />
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      )}
    </View>
  );
};

export default Card;
