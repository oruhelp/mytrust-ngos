import React from 'react';
import {View} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {ThemeContext} from '../services/ThemeContext';
import {Button} from 'react-native-elements';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export const DropDownList = props => {
  const theme = React.useContext(ThemeContext);

  return (
    <>
      <View style={{flex: 1, flexDirection: 'row'}}>
        {props.editingEnabled && (
          <Menu>
            <MenuTrigger>
              <Icon
                containerStyle={{padding: 10}}
                type="material"
                color="#C8C8C8"
                name="more-vert"
              />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption>
                <Button
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
              <MenuOption>
                <Button
                  color={theme.palette.primary.dark}
                  titleStyle={{color: theme.palette.primary.dark}}
                  type="clear"
                  title="Rename"
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
              <MenuOption>
                <Button
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
              <MenuOption>
                <Button
                  color={theme.palette.primary.dark}
                  titleStyle={{color: theme.palette.primary.dark}}
                  type="clear"
                  title="New Subpage"
                  icon={
                    <Icon
                      name="add"
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
        )}
        <View style={{flex: 1, flexDirection: 'column'}}>
          <ListItem
            leftIcon={
              <Icon
                name={
                  props.icon && props.icon.name ? props.icon.name : 'remove'
                }
                type={
                  props.icon && props.icon.type ? props.icon.type : 'material'
                }
                color={theme.palette.primary.dark}
              />
            }
            title={props.title}
            containerStyle={{
              padding: 10,
              backgroundColor: props.active
                ? theme.palette.primary.background
                : '#fff',
              borderLeftWidth: props.expanded ? 4 : 0,
              borderColor: theme.palette.primary.dark,
            }}
            titleStyle={{color: theme.palette.primary.dark, fontSize: 20}}
            chevron={
              props.children ? (
                props.expanded ? (
                  <Icon
                    name="keyboard-arrow-up"
                    color={theme.palette.primary.dark}
                  />
                ) : (
                  <Icon
                    name="keyboard-arrow-down"
                    color={theme.palette.primary.dark}
                  />
                )
              ) : (
                false
              )
            }
            onPress={props.onPress}
          />
        </View>
      </View>
      {props.expanded && props.children}
    </>
  );
};

export const DropDownListItem = props => {
  const theme = React.useContext(ThemeContext);
  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      {props.editingEnabled && (
        <Menu>
          <MenuTrigger>
            <Icon
              containerStyle={{padding: 10}}
              type="material"
              color="#C8C8C8"
              name="more-vert"
            />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption>
              <Button
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
            <MenuOption>
              <Button
                color={theme.palette.primary.dark}
                titleStyle={{color: theme.palette.primary.dark}}
                type="clear"
                title="Rename"
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
            <MenuOption>
              <Button
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
            <MenuOption>
              <Button
                color={theme.palette.primary.dark}
                titleStyle={{color: theme.palette.primary.dark}}
                type="clear"
                title="New Bottom Tab"
                icon={
                  <Icon
                    name="add"
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
      )}
      <View style={{flex: 1, flexDirection: 'column'}}>
        <ListItem
          leftIcon={
            <Icon
              name={props.icon && props.icon.name ? props.icon.name : 'remove'}
              type={
                props.icon && props.icon.type ? props.icon.type : 'material'
              }
              color={theme.palette.primary.dark}
            />
          }
          title={props.title}
          containerStyle={{
            padding: 10,
            paddingLeft: 25,
            borderLeftWidth: 4,
            borderColor: theme.palette.primary.dark,
            backgroundColor: props.active
              ? theme.palette.primary.background
              : '#fff',
          }}
          titleStyle={{color: theme.palette.primary.dark, fontSize: 17}}
          onPress={props.onPress}
        />
      </View>
    </View>
  );
};
