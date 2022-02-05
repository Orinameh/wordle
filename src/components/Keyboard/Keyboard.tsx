import { View, Text, Pressable } from "react-native";
import { keys, colors, ACTION_KEY } from "../../constants";
import styles, { keyWidth } from "./Keyboard.styles";

interface Props {
  onKeyPressed?: (key: string) => void;
  greenCaps?: Array<string>;
  yellowCaps?: Array<string>;
  greyCaps?: Array<string>;

}

const Keyboard = ({
  onKeyPressed = () => {},
  greenCaps = [],
  yellowCaps = [],
  greyCaps = [],
}: Props) => {
  const isLongButton = (key: ACTION_KEY) => {
    return key === ACTION_KEY.ENTER || key === ACTION_KEY.CLEAR;
  };

  const getKeyBGColor = (key: string) => {
    if (greenCaps.includes(key)) {
      return colors.primary;
    }
    if (yellowCaps.includes(key)) {
      return colors.secondary;
    }
    if (greyCaps.includes(key)) {
      return colors.darkgrey;
    }
    return colors.grey;
  };

  return (
    <View style={styles.keyboard}>
      {keys.map((keyRow, i) => (
        <View style={styles.row} key={`row-${i}`}>
          {keyRow.map((key) => (
            <Pressable
              onPress={() => onKeyPressed(key)}
              disabled={greyCaps.includes(key)}
              key={key}
              style={[
                styles.key,
                isLongButton(key as ACTION_KEY) ? { width: keyWidth * 1.4 } : {},
                { backgroundColor: getKeyBGColor(key) },
              ]}
            >
              <Text style={styles.keyText}>{key.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Keyboard;
