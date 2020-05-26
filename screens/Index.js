import React, {useState, useContext} from 'react';
import {Text, StyleSheet, View, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import {USER} from '../constants/roles';
import {DropDownList, DropDownListItem} from '../components/DropDownList';
import {ThemeContext} from '../services/ThemeContext';
import {UserContext} from '../services/UserContext';
import {Divider, Button, Icon} from 'react-native-elements';

import Page from '../components/Page';
import Login from './Login';
import {name} from '../package.json';

const _firebasePath = `orgs/${name.toLowerCase()}/appData`;
function CustomDrawerContent(props) {
  const [activeTab, setActiveTab] = useState('');
  const [expandedList, setExpandedList] = useState('');
  const theme = useContext(ThemeContext);
  const {user, role, disableAdmin} = useContext(UserContext);

  React.useEffect(() => {
    setActiveTab(props.initialActiveTab);
    if (
      props.appData &&
      props.appData.collection &&
      props.appData.collection.order &&
      props.appData.collection.order.length > 0 &&
      props.appData.collection[props.appData.collection.order[0]].pages &&
      props.appData.collection[props.appData.collection.order[0]].pages.order &&
      props.appData.collection[props.appData.collection.order[0]].pages.order
        .length > 0
    ) {
      setExpandedList(
        props.appData.collection[props.appData.collection.order[0]].key,
      );
    }
  }, []);

  const styles = StyleSheet.create({
    title: {
      fontSize: 30,
      padding: 10,
      paddingTop: 20,
      paddingBottom: 20,
      marginBottom: 10,
      color: theme.palette.primary.dark,
    },
    subTitle: {
      padding: 10,
      marginTop: -25,
      color: theme.palette.primary.dark,
    },
  });
  return (
    <>
      <View style={{flex: 1}}>
        <DrawerContentScrollView {...props}>
          <Text style={styles.title}>
            {props.appData && props.appData.title}
          </Text>
          {user && user.email && (
            <>
              <Text style={styles.subTitle}>{user.email}</Text>
              <Text style={styles.subTitle}>
                {role && (role !== USER ? `(${role})` : '')}
              </Text>
            </>
          )}
          <Divider />
          {!user && (
            <DropDownList
              title="Login"
              active={activeTab === 'Login'}
              icon={{name: 'sign-in', type: 'octicon'}}
              onPress={() => {
                setActiveTab('Login');
                props.navigation.navigate('Login');
              }}
            />
          )}
          {props.appData &&
            props.appData.collection &&
            props.appData.collection.order &&
            props.appData.collection.order.length > 0 &&
            props.appData.collection.order.map(_page => (
              <DropDownList
                editingEnabled={!disableAdmin}
                key={props.appData.collection[_page].key}
                title={props.appData.collection[_page].title}
                icon={props.appData.collection[_page].icon}
                active={
                  props.appData.collection[_page].pages &&
                  props.appData.collection[_page].pages.order &&
                  props.appData.collection[_page].pages.order.length > 0 &&
                  props.appData.collection[_page].pages.order.length === 1 &&
                  activeTab ===
                    props.appData.collection[_page].pages[
                      props.appData.collection[_page].pages.order[0]
                    ].key
                }
                expanded={
                  props.appData.collection[_page].pages &&
                  props.appData.collection[_page].pages.order &&
                  props.appData.collection[_page].pages.order.length > 0 &&
                  props.appData.collection[_page].pages.order.length !== 1 &&
                  expandedList === props.appData.collection[_page].key
                }
                onPress={() => {
                  if (
                    props.appData.collection[_page].pages &&
                    props.appData.collection[_page].pages.order &&
                    props.appData.collection[_page].pages.order.length > 0 &&
                    props.appData.collection[_page].pages.order.length !== 1
                  ) {
                    expandedList !== props.appData.collection[_page].key
                      ? setExpandedList(props.appData.collection[_page].key)
                      : setExpandedList('');
                  } else {
                    setActiveTab(
                      props.appData.collection[_page].pages[
                        props.appData.collection[_page].pages.order[0]
                      ].key,
                    );
                    props.navigation.navigate('Page', {
                      ...props.appData.collection[_page].pages[
                        props.appData.collection[_page].pages.order[0]
                      ],
                      title: props.appData.collection[_page].pages[
                        props.appData.collection[_page].pages.order[0]
                      ].title
                        ? props.appData.collection[_page].pages[
                            props.appData.collection[_page].pages.order[0]
                          ].title
                        : props.appData.collection[_page].title,
                      disableAdmin: disableAdmin,
                    });
                  }
                }}>
                {props.appData.collection[_page].pages &&
                  props.appData.collection[_page].pages.order &&
                  props.appData.collection[_page].pages.order.length > 0 &&
                  props.appData.collection[_page].pages.order.length !== 1 &&
                  props.appData.collection[_page].pages.order.map(_subPage => (
                    <DropDownListItem
                      editingEnabled={!disableAdmin}
                      key={props.appData.collection[_page].pages[_subPage].key}
                      title={
                        props.appData.collection[_page].pages[_subPage].title
                      }
                      active={
                        activeTab ===
                        props.appData.collection[_page].pages[_subPage].key
                      }
                      icon={
                        props.appData.collection[_page].pages[_subPage].icon
                          ? props.appData.collection[_page].pages[_subPage].icon
                          : 'remove'
                      }
                      iconType={
                        props.appData.collection[_page].pages[_subPage].iconType
                          ? props.appData.collection[_page].pages[_subPage]
                              .iconType
                          : 'remove'
                      }
                      onPress={() => {
                        setActiveTab(
                          props.appData.collection[_page].pages[_subPage].key,
                        );
                        props.navigation.navigate('Page', {
                          ...props.appData.collection[_page].pages[_subPage],
                          disableAdmin: disableAdmin,
                        });
                      }}
                    />
                  ))}
              </DropDownList>
            ))}
          {!disableAdmin && (
            <Button
              color={theme.palette.primary.dark}
              titleStyle={{color: theme.palette.primary.dark}}
              containerStyle={{padding: 10}}
              buttonStyle={{borderColor: theme.palette.primary.dark}}
              type="outline"
              title="Add Page"
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
          )}
          <Divider />
          {user && (
            <DropDownList
              title="Signout"
              icon={{name: 'sign-out', type: 'octicon'}}
              onPress={() => {
                Alert.alert(
                  'Signout',
                  'Are you sure you want to signout?',
                  [
                    {text: 'Yes', onPress: () => auth().signOut()},
                    {
                      text: 'No',
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false},
                );
              }}
            />
          )}
        </DrawerContentScrollView>
      </View>
    </>
  );
}

const Drawer = createDrawerNavigator();

export default function Index(props) {
  const initialPageData =
    props.appData &&
    props.appData.collection &&
    props.appData.collection.order &&
    props.appData.collection.order.length > 0 &&
    props.appData.collection[props.appData.collection.order[0]].pages &&
    props.appData.collection[props.appData.collection.order[0]].pages.order &&
    props.appData.collection[props.appData.collection.order[0]].pages.order
      .length > 0 &&
    props.appData.collection[props.appData.collection.order[0]].pages[
      props.appData.collection[props.appData.collection.order[0]].pages.order[0]
    ];

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={_props => (
          <CustomDrawerContent
            {..._props}
            appData={props.appData}
            oruHelp={props.oruHelp}
            initialActiveTab={initialPageData.key}
          />
        )}>
        <Drawer.Screen
          name="InitialPage"
          component={Page}
          initialParams={{
            ...initialPageData,
            firebasePath:
              _firebasePath +
              '/collection/' +
              props.appData.collection.order[0] +
              '/pages/' +
              props.appData.collection[props.appData.collection.order[0]].pages
                .order[0],
          }}
        />
        <Drawer.Screen
          name="Page"
          component={Page}
          initialParams={{
            ...initialPageData,
          }}
        />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen
          name="OruHelp"
          component={Page}
          initialParams={{...props.oruHelp, custompage: 'oruhelp'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
