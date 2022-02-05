import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ACTION_KEY, colors, colorsToEmoji } from "./src/constants";
import Keyboard from "./src/components/Keyboard";
import { useEffect, useState } from "react";
import { GameState } from "./src/types";
import { setString } from "expo-clipboard";

const NUMBER_OF_TRIES = 6;

const _getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = +now - +start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
}

// Array of 5 letter words for the year
const words = []
export default function App() {
  const word = "hello";
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameState, setGameState] = useState(GameState.PLAYING);

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState();
    }
  }, [currentRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState !== GameState.WON) {
      Alert.alert("Yaaay...", "You won", [
        { text: "Share", onPress: shareScore },
      ]);
      setGameState(GameState.WON);
    } else if (checkIfLoss() && gameState !== GameState.LOST) {
      Alert.alert("Ouch...", "Try later tomorrow..");
      setGameState(GameState.LOST);
    }
  };

  const shareScore = () => {
    const textToShare = rows.map((row, i) =>
      row.map((cell: string, j: number) => colorsToEmoji[getCellBgColor(i, j)]).join('')
    ).filter(row => row).join('\n');

    setString(`Wordle \n ${textToShare}`);
    Alert.alert("Copied successfully", "Share your score on social media");
  };

  const checkIfWon = () => {
    const row = rows[currentRow - 1];
    return row.every((letter: string, i: number) => letter === letters[i]);
  };

  const checkIfLoss = () => {
    return !checkIfWon() && currentRow === rows.length;
  };

  const onKeyPressed = (key: string) => {
    if (gameState !== GameState.PLAYING) {
      return;
    }
    // Since this is a 2-D nested array, we need to copy the outer and inner array
    const coppiedRows = [...rows].map((items) => [...items]);

    if (key === ACTION_KEY.CLEAR) {
      const prevCol = currentCol > 0 ? currentCol - 1 : 0;
      coppiedRows[currentRow][prevCol] = "";
      setRows(coppiedRows);
      setCurrentCol(prevCol);
      return;
    }

    if (key === ACTION_KEY.ENTER) {
      if (currentCol === rows[0].length && currentRow < rows.length) {
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
      return;
    }
    if (currentCol < rows[0].length && currentRow < rows.length) {
      coppiedRows[currentRow][currentCol] = key;
      setRows(coppiedRows);
      setCurrentCol(currentCol + 1);
    }
  };

  const isCellActive = (row: number, col: number) => {
    return row === currentRow && col === currentCol;
  };

  const getCellBgColor = (row: number, col: number) => {
    const letter = rows[row][col];

    if (row >= currentRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }

    return colors.darkgrey;
  };

  const getTextWithColor = (color: string) =>
    rows.flatMap((row, i) =>
      row.filter((cell: string, j: number) => getCellBgColor(i, j) === color)
    );

  const greenCaps = getTextWithColor(colors.primary);
  const yellowCaps = getTextWithColor(colors.secondary);
  const greyCaps = getTextWithColor(colors.darkgrey);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.cellContainer}>
        {rows.map((row, i: number) => (
          <View style={styles.cellRow} key={`row-${i}`}>
            {row.map((letter: string, j: number) => (
              <View
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.lightgrey
                      : colors.darkgrey,
                    backgroundColor: getCellBgColor(i, j),
                  },
                ]}
                key={`cell-${i}-${j}`}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard
        onKeyPressed={onKeyPressed}
        yellowCaps={yellowCaps}
        greenCaps={greenCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },
  cellContainer: {
    alignSelf: "stretch",
    marginVertical: 20,
  },
  cellRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    margin: 3,
    maxWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  },
});
