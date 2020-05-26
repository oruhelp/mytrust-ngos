import React from 'react';
import {View, ActivityIndicator, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {ThemeContext} from '../services/ThemeContext';

const Images = props => {
  const theme = React.useContext(ThemeContext);

  const [preview, setPreview] = React.useState(false);
  const [previewImageSource, setPreviewImageSource] = React.useState([]);

  React.useEffect(() => {
    if (props && props.images && props.images.length > 0) {
      let newArr = [];
      for (let i = 0; i < props.images.length; i++) {
        let obj = props.images[i];
        if (obj && obj.uri) {
          obj.url = obj.uri;
          newArr.push(obj);
        }
      }
      setPreviewImageSource(newArr);
    }
  }, [props]);
  const styles = {
    buttonContainer: {
      margin: 10,
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
  };

  return (
    <View>
      {previewImageSource && previewImageSource.length > 0 && (
        <Modal visible={preview} transparent={true}>
          <ImageViewer
            backgroundColor={theme.palette.primary.background + 'fa'}
            imageUrls={previewImageSource}
            enableSwipeDown
            swipeDownThreshold={5}
            onSwipeDown={() => setPreview(false)}
            onDoubleClick={() => setPreview(false)}
          />
        </Modal>
      )}
      <TouchableOpacity onPress={() => setPreview(true)}>
        <Image
          style={{
            flex: 1,
            width: null,
            height: 300,
            marginTop: 10,
          }}
          source={props.images[0]}
          PlaceholderContent={
            <ActivityIndicator
              size="large"
              color={theme.palette.primary.dark}
            />
          }
        />
        {props.images && props.images.length > 1 && (
          <Icon
            name="more-horiz"
            size={50}
            color={theme.palette.primary.dark}
            containerStyle={{
              margin: -20,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Images;
