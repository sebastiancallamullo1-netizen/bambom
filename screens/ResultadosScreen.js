import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useGame } from '../juegocontext';

export default function ResultadosScreen({ navigation }) {
  const { ganador, nombreJ1, nombreJ2, vidasJ1, vidasJ2, reiniciarJuego } = useGame();

  const nombreGanador = ganador === 'J1' ? nombreJ1 : nombreJ2;
  const vidasRestantes = ganador === 'J1' ? vidasJ1 : vidasJ2;

  function jugarDeNuevo() {
    reiniciarJuego();
    navigation.replace('Colocacion');
  }

  function volverAlMenu() {
    reiniciarJuego();
    navigation.replace('Seleccion');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icono}>🏆</Text>
      <Text style={styles.titulo}>Ganó {nombreGanador}</Text>
      <Text style={styles.subtitulo}>{vidasRestantes} vida(s) restante(s)</Text>

      <TouchableOpacity style={styles.botonPrimario} onPress={jugarDeNuevo}>
        <Text style={styles.textoPrimario}>Jugar de nuevo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={volverAlMenu}>
        <Text style={styles.textoSecundario}>Volver al menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF3E3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  icono: {
    fontSize: 40,
  },
  titulo: {
    color: '#27500A',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitulo: {
    color: '#3B6D11',
    fontSize: 13,
    marginBottom: 12,
  },
  botonPrimario: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  textoPrimario: {
    color: '#12141C',
    fontSize: 14,
    fontWeight: '700',
  },
  botonSecundario: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3A3F55',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  textoSecundario: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
});