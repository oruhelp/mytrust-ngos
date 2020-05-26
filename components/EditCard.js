import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import uuid from 'react-native-uuid';

import Card from './Card';
import {Button, Input, Divider} from 'react-native-elements';
import {ThemeContext} from '../services/ThemeContext';

const EditCard = props => {
  const theme = React.useContext(ThemeContext);
  const [cardData, setCardData] = React.useState();
  const [preview, setPreview] = React.useState(false);
  const sampleMD = `
  Headings

  # h1 Heading 8-)
  ## h2 Heading
  ## **h2** Heading __with Bold__
  ### h3 Heading
  ### *h3* Heading _with Italic_
  #### h4 Heading
  ##### h5 Heading
  ###### h6 Heading


Horizontal Rules

  Some text above
  ___

  Some text in the middle

  ---

  Some text below


Emphasis

  **This is bold text**

  __This is bold text__

  *This is italic text*

  _This is italic text_

  ~~Strikethrough~~


Blockquotes

  > Blockquotes can also be nested...
  >> ...by using additional greater-than signs right next to each other...
  > > > ...or with spaces between arrows.


Lists

  Unordered

  + Create a list by starting a line with
  + Sub-lists are made by indenting 2 spaces:
    - Marker character change forces new list start:
      * Ac tristique libero volutpat at
      + Facilisis in pretium nisl aliquet
      - Nulla volutpat aliquam velit
  + Very easy!

  Ordered

  1. Lorem ipsum dolor sit amet
  2. Consectetur adipiscing elit
  3. Integer molestie lorem at massa

  Start numbering with offset:

  57. foo
  58. bar


Tables

  | Option | Description |
  | ------ | ----------- |
  | data   | path to data files to supply the data that will be passed into templates. |
  | engine | engine to be used for processing templates. Handlebars is the default. |
  | ext    | extension to be used for dest files. |

Links

  [link text](https://www.google.com)
Images

  ![Minion](https://octodex.github.com/images/minion.png)

Typographic Replacements

  Enable typographer option to see result.

  (c) (C) (r) (R) (tm) (TM) (p) (P) +-
`;

  React.useEffect(() => {
    if (props.editMode) {
      setCardData(props.data);
    } else {
      var _cardId = uuid.v1();
      var _descriptionId = uuid.v1();
      const _newCard = {
        components: {
          [_descriptionId]: {
            type: 'markdown',
            value: '',
          },
          order: [_descriptionId],
        },
        key: _cardId,
        title: '',
      };
      setCardData(_newCard);
    }
  }, []);

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.background + 'd0',
    },
    modalView: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      width: '100%',
      padding: 5,
      height: '90%',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      justifyContent: 'space-between',
      shadowOpacity: 0.25,
      shadowRadius: 13.84,
      elevation: 5,
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
  });

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent visible>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[styles.textStyle, {alignSelf: 'center', fontSize: 20}]}>
              {props.editMode ? 'Edit Card' : 'New Card'}
            </Text>
            <Divider
              style={{
                backgroundColor: theme.palette.primary.dark,
                marginTop: 10,
                height: 2,
              }}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button
                title={preview ? 'Edit' : 'Preview'}
                type="clear"
                titleStyle={{color: theme.palette.primary.dark}}
                onPress={() => setPreview(!preview)}
              />
              <Button
                title="Load Sample"
                type="clear"
                titleStyle={{color: theme.palette.primary.dark}}
                onPress={() => {
                  var _cardId = uuid.v1();
                  var _descriptionId = uuid.v1();
                  const _newCard = {
                    components: {
                      [_descriptionId]: {
                        type: 'markdown',
                        value: sampleMD.toString(),
                      },
                      order: [_descriptionId],
                    },
                    key: _cardId,
                    title: '',
                  };
                  setCardData(_newCard);
                }}
              />
            </View>
            <ScrollView>
              {cardData && false && (
                <Input
                  placeholder="Title"
                  style={[styles.modalElements, {height: '100%'}]}
                  value={cardData.title}
                  onChangeText={_value =>
                    setCardData({
                      ...cardData,
                      title: _value,
                    })
                  }
                />
              )}

              {cardData &&
                cardData.components &&
                cardData.components.order &&
                cardData.components.order.length > 0 &&
                cardData.components.order.map(_componentId => {
                  if (cardData.components[_componentId].type === 'markdown') {
                    if (preview) {
                      return <Card {...cardData} />;
                    } else {
                    }
                    return (
                      <TextInput
                        key={_componentId}
                        placeholder="Type Here"
                        multiline
                        value={cardData.components[_componentId].value}
                        style={[styles.modalElements, {borderWidth: 1}]}
                        onChangeText={_value =>
                          setCardData({
                            ...cardData,
                            components: {
                              ...cardData.components,
                              [_componentId]: {
                                ...cardData.components[_componentId],
                                value: _value,
                              },
                            },
                          })
                        }
                      />
                    );
                  }
                })}
            </ScrollView>
            {props.editMode ? (
              <>
                <Button
                  title={props.loading ? 'Loading...' : 'Update'}
                  buttonStyle={styles.button}
                  onPress={() => props.updateCard(cardData)}
                />
              </>
            ) : (
              <>
                <Button
                  title={props.loading ? 'Loading...' : 'Add Card'}
                  buttonStyle={styles.button}
                  onPress={() => props.addCard(cardData)}
                />
              </>
            )}
            <Button
              title="Cancel"
              buttonStyle={styles.button}
              onPress={props.onCancel}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditCard;
