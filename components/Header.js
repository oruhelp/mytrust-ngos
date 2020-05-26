import React, {useContext} from 'react';
import {Header as NativeHeader, Button} from 'react-native-elements';
import {ThemeContext} from '../services/ThemeContext';

const Header = props => {
  const theme = useContext(ThemeContext);
  return (
    <NativeHeader
      backgroundColor={theme.palette.primary.dark}
      leftComponent={
        <Button
          buttonStyle={{
            padding: 0,
            marginLeft: -8,
            backgroundColor: theme.palette.primary.dark,
          }}
          icon={{
            name: 'menu',
            size: 30,
            color: 'white',
          }}
          onPress={() => props.navigation.openDrawer()}
        />
      }
      centerComponent={{
        text: props.title,
        style: {color: '#fff', fontSize: 20},
      }}
      containerStyle={{marginTop: -35}}
    />
  );
};

export default Header;
