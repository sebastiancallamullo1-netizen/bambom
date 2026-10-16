import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useGame } from '../juegocontext';

export default function SeleccionScreen({ navigation }) {
  const { nombreJ1, modoJuego, setModoJuego, dificultadCPU, setDificultadCPU, setNombreJ2 } = useGame();

  function elegirModo(nuevoModo) {
    setModoJuego(nuevoModo);
    setNombreJ2(nuevoModo === 'cpu' ? 'CPU' : 'Sebastian');
  }

  const esCPU = modoJuego === 'cpu';

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BAMBOOM</Text>
      <Text style={styles.titulo}>ELEGI RIVAL</Text>

      <View style={styles.filaVS}>
        <View style={styles.tarjetaJ1}>
          <View style={styles.avatarJ1}>
            <Text style={styles.avatarTexto}>J1</Text>
          </View>
          <Text style={styles.nombreJ1}>{nombreJ1}</Text>
        </View>

        <Text style={styles.vsTexto}>VS</Text>

        <View style={styles.tarjetaJ2}>
          <View style={styles.avatarJ2}>
            <Text style={styles.avatarTextoJ2}>{esCPU ? 'CPU' : 'J2'}</Text>
          </View>
          <Text style={styles.nombreJ2}>{esCPU ? 'CPU' : 'Sebastian'}</Text>
        </View>
      </View>

      <View style={styles.filaToggle}>
        <TouchableOpacity
          style={[styles.botonToggle, modoJuego === '2jugadores' && styles.botonToggleActivo]}
          onPress={() => elegirModo('2jugadores')}
        >
          <Text style={[styles.textoToggle, modoJuego === '2jugadores' && styles.textoToggleActivo]}>
            J1 VS J2
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonToggleCpu, esCPU && styles.botonToggleCpuActivo]}
          onPress={() => elegirModo('cpu')}
        >
          <Text style={[styles.textoToggleCpu, esCPU && styles.textoToggleCpuActivo]}>
            J1 VS CPU
          </Text>
        </TouchableOpacity>
      </View>

      {esCPU && (
        <View style={styles.filaDificultad}>
          <TouchableOpacity
            style={[styles.botonDificultad, dificultadCPU === 'facil' && styles.botonDificultadActivo]}
            onPress={() => setDificultadCPU('facil')}
          >
            <Text style={[styles.textoDificultad, dificultadCPU === 'facil' && styles.textoDificultadActivo]}>
              Fácil
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botonDificultad, dificultadCPU === 'medio' && styles.botonDificultadActivo]}
            onPress={() => setDificultadCPU('medio')}
          >
            <Text style={[styles.textoDificultad, dificultadCPU === 'medio' && styles.textoDificultadActivo]}>
              Medio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botonDificultad, dificultadCPU === 'dificil' && styles.botonDificultadActivo]}
            onPress={() => setDificultadCPU('dificil')}
          >
            <Text style={[styles.textoDificultad, dificultadCPU === 'dificil' && styles.textoDificultadActivo]}>
              Difícil
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.botonComenzar}
        onPress={() => navigation.navigate('Colocacion')}
      >
        <Text style={styles.textoComenzar}>Comenzar partida</Text>
      </TouchableOpacity>

      <View style={styles.filaAtajos}>
        <TouchableOpacity style={styles.botonAtajo} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.textoAtajo}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonAtajo} onPress={() => navigation.navigate('Estadisticas')}>
          <Text style={styles.textoAtajo}>Estadísticas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonAtajo} onPress={() => navigation.navigate('Historial')}>
          <Text style={styles.textoAtajo}>Historial</Text>
        </TouchableOpacity>
      </View>
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
  },
  titulo: {
    color: '#ffffff',
    fontSize: 13,
    letterSpacing: 3,
    marginBottom: 40,
    fontWeight: '600',
  },
  logo: {
    color: '#a53333',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 4,
  },
  filaVS: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 48,
  },
  tarjetaJ1: {
    width: 120,
    height: 170,
    backgroundColor: '#12141C',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  avatarJ1: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: '#12141C',
    fontSize: 20,
    fontWeight: '700',
  },
  nombreJ1: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  vsTexto: {
    color: '#F2A93B',
    fontSize: 30,
    fontWeight: '800',
  },
  tarjetaJ2: {
    width: 120,
    height: 170,
    backgroundColor: '#12141C',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  avatarJ2: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextoJ2: {
    color: '#12141C',
    fontSize: 20,
    fontWeight: '700',
  },
  nombreJ2: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  filaToggle: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  botonToggle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  botonToggleActivo: {
    backgroundColor: '#FF6B35',
  },
  textoToggle: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },
  textoToggleActivo: {
    color: '#12141C',
  },
  botonToggleCpu: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F2A93B',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  botonToggleCpuActivo: {
    backgroundColor: '#F2A93B',
  },
  textoToggleCpu: {
    color: '#F2A93B',
    fontSize: 12,
    fontWeight: '600',
  },
  textoToggleCpuActivo: {
    color: '#412402',
  },
  filaDificultad: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  botonDificultad: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6B6B6B',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  botonDificultadActivo: {
    backgroundColor: '#6CA6D9',
    borderColor: '#6CA6D9',
  },
  textoDificultad: {
    color: '#6B6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
  textoDificultadActivo: {
    color: '#12141C',
  },
  botonComenzar: {
    backgroundColor: '#F2A93B',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  textoComenzar: {
    color: '#412402',
    fontSize: 14,
    fontWeight: '700',
  },
  filaAtajos: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 28,
  },
  botonAtajo: {
    borderWidth: 1,
    borderColor: '#3A3F55',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  textoAtajo: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});