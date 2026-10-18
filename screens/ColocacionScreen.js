import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useGame } from '../juegocontext';

export default function ColocacionScreen({ navigation }) {
  const { nombreJ1, nombreJ2, tableroJ1, tableroJ2, alternarBomba, modoJuego, colocarBombasAleatorias } = useGame();
  const [jugadorActual, setJugadorActual] = useState('J1');

  const esJ1 = jugadorActual === 'J1';
  const tablero = esJ1 ? tableroJ1 : tableroJ2;
  const nombre = esJ1 ? nombreJ1 : nombreJ2;
  const bombasColocadas = tablero.filter((c) => c.bomba).length;
  const listo = bombasColocadas === 3;

  function confirmar() {
    if (!listo) return;
    if (esJ1) {
      if (modoJuego === 'cpu') {
        colocarBombasAleatorias('J2');
        navigation.replace('Tablero');
      } else {
        setJugadorActual('J2');
      }
    } else {
      navigation.replace('Tablero');
    }
  }
function crearTableroVacio() {
  return Array(9).fill(null).map(() => ({
    bomba: false,
    revelada: false,
  }));
}

function alternarBomba(jugador, indice) {
  const esJ1 = jugador === 'J1';
  const tablero = esJ1 ? tableroJ1 : tableroJ2;
  const setTablero = esJ1 ? setTableroJ1 : setTableroJ2;

  let tableroActual = tablero.length === 0 ? crearTableroVacio() : [...tablero];

  const bombasActuales = tableroActual.filter((c) => c.bomba).length;
  const casilla = tableroActual[indice];

  if (casilla.bomba) {
    tableroActual[indice] = { ...casilla, bomba: false };
    setTablero(tableroActual);
    return;
  }

  if (bombasActuales >= 3) return;

  tableroActual[indice] = { ...casilla, bomba: true };
  setTablero(tableroActual);
}

function colocarBombasAleatorias(jugador) {
  const esJ1 = jugador === 'J1';
  const setTablero = esJ1 ? setTableroJ1 : setTableroJ2;

  const nuevoTablero = crearTableroVacio();
  const posiciones = [];

  while (posiciones.length < 3) {
    const random = Math.floor(Math.random() * 9);
    if (!posiciones.includes(random)) {
      posiciones.push(random);
    }
  }

  posiciones.forEach((pos) => {
    nuevoTablero[pos].bomba = true;
  });

  setTablero(nuevoTablero);
}
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{nombre} — Colocá 3 bombas</Text>
      <Text style={styles.contador}>Bombas: {bombasColocadas}/3</Text>

      <View style={styles.grilla}>
        {tablero.map((casilla, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.casilla, casilla.bomba && styles.casillaConBomba]}
            onPress={() => alternarBomba(jugadorActual, index)}
          >
            {casilla.bomba && <Text style={styles.iconoBomba}>💣</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.botonConfirmar, !listo && styles.botonDeshabilitado]}
        onPress={confirmar}
        disabled={!listo}
      >
        <Text style={styles.textoConfirmar}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12141C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  titulo: {
    color: '#F4F1EA',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  contador: {
    color: '#6B6B6B',
    fontSize: 13,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 220,
    justifyContent: 'space-between',
    gap: 8,
  },
  casilla: {
    width: 68,
    height: 68,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3A3F55',
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  casillaConBomba: {
    backgroundColor: '#79B0DD',
    borderStyle: 'solid',
  },
  iconoBomba: {
    fontSize: 24,
  },
  botonConfirmar: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 12,
  },
  botonDeshabilitado: {
    backgroundColor: '#A9C7E0',
  },
  textoConfirmar: {
    color: '#12141C',
    fontSize: 14,
    fontWeight: '700',
  },
});