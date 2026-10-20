import { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const COLORS = ["#ff3b30", "#34c759", "#007aff", "#ffd60a"] as const;
type Color = (typeof COLORS)[number];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function SimonScreen() {
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [status, setStatus] = useState("Toca empezar");
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const playSequence = async (seqToPlay: Color[]) => {
    setIsUserTurn(false);
    setStatus("Atento a la secuencia...");

    await sleep(600);

    for (const color of seqToPlay) {
      setActiveColor(color);
      await sleep(450);
      setActiveColor(null);
      await sleep(200);
    }

    setUserStep(0);
    setStatus("¡Tu turno!");
    setIsUserTurn(true);
  };

  const pressColor = (color: Color) => {
    if (!isUserTurn) return;

    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    if (color !== sequence[userStep]) {
      setStatus("¡Perdiste! Toca empezar");
      setIsUserTurn(false);
      return;
    }

    const nextStep = userStep + 1;

    if (nextStep === sequence.length) {
      const currentScore = sequence.length;
      if (currentScore > highScore) {
        setHighScore(currentScore);
      }

      setStatus(`¡Ronda ${currentScore} superada!`);
      setIsUserTurn(false);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        const nextColor = COLORS[randomIndex];
        const nextSeq = [...sequence, nextColor];

        setSequence(nextSeq);
        playSequence(nextSeq);
      }, 1000);
    } else {
      setUserStep(nextStep);
    }
  };

  const startGame = () => {
    setUserStep(0);
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    const firstColor = COLORS[randomIndex];
    const initialSeq: Color[] = [firstColor];

    setSequence(initialSeq);
    playSequence(initialSeq);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreboard}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>RONDA</Text>
          <Text style={styles.scoreValue}>{sequence.length}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>RÉCORD</Text>
          <Text style={[styles.scoreValue, { color: "#ffd60a" }]}>
            {highScore}
          </Text>
        </View>
      </View>

      <Text style={styles.statusText}>{status}</Text>

      <View style={styles.grid}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            disabled={!isUserTurn}
            activeOpacity={0.85}
            style={[
              styles.pad,
              { backgroundColor: color },
              activeColor === color ? styles.padActive : styles.padInactive,
            ]}
            onPress={() => pressColor(color)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.startButton, isUserTurn && styles.startButtonDisabled]}
        onPress={startGame}
        disabled={isUserTurn}
      >
        <Text style={styles.startText}>
          {sequence.length === 0 ? "Empezar" : "Reiniciar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
  },
  scoreboard: {
    flexDirection: "row",
    gap: 40,
  },
  scoreBox: {
    alignItems: "center",
  },
  scoreLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  scoreValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  statusText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    minHeight: 28,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 260,
    gap: 12,
    justifyContent: "center",
  },
  pad: {
    width: 120,
    height: 120,
    borderRadius: 18,
  },
  padInactive: {
    opacity: 0.25,
  },
  padActive: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  startButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  startButtonDisabled: {
    opacity: 0.4,
  },
  startText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});