import React from 'react';
import Channel from './Channel';
import {Icon} from 'react-native-elements';
import {ThemeContext} from '../services/ThemeContext';
import Header from './Header';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tabs = createBottomTabNavigator();

const Page = props => {
  const theme = React.useContext(ThemeContext);
  const _page = props.route && props.route.params;
  return (
    <React.Fragment key={_page.key}>
      <Header {...props} title={_page.title} />
      <Tabs.Navigator
        screenOptions={({route}) => ({
          tabBarVisible:
            _page.tabs &&
            _page.tabs.order &&
            _page.tabs.order.length > 0 &&
            _page.tabs.order.length !== 1,
          tabBarIcon: ({focused}) => {
            const tab = _page.tabs.order.filter(
              _tab => _page.tabs[_tab].title === route.name,
            );

            let iconName = 'radio-button-unchecked';
            if (_page.tabs[tab].icon && _page.tabs[tab].icon.name) {
              iconName = _page.tabs[tab].icon.name;
            }
            let iconType = 'material';
            if (_page.tabs[tab].icon && _page.tabs[tab].icon.type) {
              iconType = _page.tabs[tab].icon.type;
            }

            return (
              <Icon
                name={iconName}
                type={iconType}
                color={
                  focused
                    ? theme.palette.primary.dark
                    : theme.palette.primary.main
                }
                size={25}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: theme.palette.primary.dark,
          inactiveTintColor: theme.palette.primary.main,
          activeBackgroundColor: theme.palette.primary.background,
          tabBarVisible: false,
        }}>
        {_page.tabs &&
          _page.tabs.order &&
          _page.tabs.order.length > 0 &&
          (_page.tabs.order.length === 1 ? (
            <Tabs.Screen
              name="OneTab"
              component={Channel}
              initialParams={{
                ..._page.tabs[_page.tabs.order[0]],
                custompage: _page.custompage,
                disableAdmin: _page.disableAdmin,
              }}
            />
          ) : (
            _page.tabs.order.map(_tab => (
              <Tabs.Screen
                key={_page.tabs[_tab].key}
                name={_page.tabs[_tab].title}
                component={Channel}
                initialParams={{
                  ..._page.tabs[_tab],
                  custompage: _page.custompage,
                  disableAdmin: _page.disableAdmin,
                }}
              />
            ))
          ))}
      </Tabs.Navigator>
    </React.Fragment>
  );
};

export default Page;
