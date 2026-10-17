import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useGame } from '../juegocontext';

export default function TableroScreen({ navigation }) {
  const {
    nombreJ1, nombreJ2,
    tableroJ1, tableroJ2,
    vidasJ1, vidasJ2,
    turno, ganador,
    atacarCasilla,
    modoJuego, jugarTurnoCPU,
  } = useGame();

  const explosion = useRef(new Animated.Value(0)).current;
  const sacudida = useRef(new Animated.Value(0)).current;
  const vidasPrevias = useRef({ j1: vidasJ1, j2: vidasJ2 });

  useEffect(() => {
    if (ganador) {
      const espera = setTimeout(() => navigation.replace('Resultados'), 1200);
      return () => clearTimeout(espera);
    }
  }, [ganador]);

  useEffect(() => {
    const exploto = vidasJ1 < vidasPrevias.current.j1 || vidasJ2 < vidasPrevias.current.j2;
    vidasPrevias.current = { j1: vidasJ1, j2: vidasJ2 };
    if (!exploto) return;

    explosion.setValue(0);
    Animated.timing(explosion, { toValue: 1, duration: 900, useNativeDriver: true }).start();

    sacudida.setValue(0);
    Animated.sequence([
      Animated.timing(sacudida, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(sacudida, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(sacudida, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(sacudida, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(sacudida, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [vidasJ1, vidasJ2]);

  const escalaExplosion = explosion.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.2, 1.4, 1.8] });
  const opacidadExplosion = explosion.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 0.9, 0] });
  const escalaAnillo = explosion.interpolate({ inputRange: [0, 1], outputRange: [0.3, 3] });
  const opacidadAnillo = explosion.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 0.6, 0] });

  const esTurnoDeCPU = modoJuego === 'cpu' && turno === 'J2';

  useEffect(() => {
    if (esTurnoDeCPU && !ganador) {
      const timer = setTimeout(() => {
        jugarTurnoCPU();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [turno, ganador, modoJuego]);

  const esTurnoJ1 = turno === 'J1';
  const nombreEnTurno = esTurnoJ1 ? nombreJ1 : nombreJ2;
  const nombreEspera = esTurnoJ1 ? nombreJ2 : nombreJ1;
  const tableroVisible = esTurnoJ1 ? tableroJ2 : tableroJ1;

  const corazonesJ1 = '♥'.repeat(vidasJ1) + '♡'.repeat(3 - vidasJ1);
  const corazonesJ2 = '♥'.repeat(vidasJ2) + '♡'.repeat(3 - vidasJ2);

  return (
    <View style={styles.container}>
      <View style={styles.filaVidas}>
        <View style={[styles.tarjetaVidas, esTurnoJ1 && styles.tarjetaVidasActiva]}>
          <Text style={styles.nombreVidas}>{nombreJ1}</Text>
          <Text style={styles.vidas}>{corazonesJ1}</Text>
        </View>
        <View style={[styles.tarjetaVidas, !esTurnoJ1 && styles.tarjetaVidasActiva]}>
          <Text style={styles.nombreVidas}>{nombreJ2}</Text>
          <Text style={styles.vidas}>{corazonesJ2}</Text>
        </View>
      </View>

      <View style={styles.filaSuperior}>
        <View style={styles.turnoInfo}>
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{esTurnoJ1 ? 'J1' : 'J2'}</Text>
          </View>
          <Text style={styles.turnoTexto}>
            Turno: {esTurnoDeCPU ? 'CPU pensando...' : nombreEnTurno}
          </Text>
        </View>
      </View>

      <Animated.View style={[styles.grilla, { transform: [{ translateX: sacudida }] }]}>
        {tableroVisible.map((casilla, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.casilla,
              casilla.revelada && casilla.bomba && styles.casillaBomba,
              casilla.revelada && !casilla.bomba && styles.casillaAcierto,
            ]}
            onPress={() => atacarCasilla(index)}
            disabled={casilla.revelada || esTurnoDeCPU}
          >
            {casilla.revelada && casilla.bomba && <Text style={styles.iconoBomba}>💥</Text>}
            {casilla.revelada && !casilla.bomba && <Text style={styles.iconoAcierto}>✓</Text>}
          </TouchableOpacity>
        ))}
      </Animated.View>

      <Text style={styles.ayuda}>
        {esTurnoDeCPU ? 'La CPU está eligiendo su ataque' : `Elegí una casilla del tablero de ${nombreEspera}`}
      </Text>

      <View style={styles.esperaFila}>
        <Text style={styles.esperaTexto}>{nombreEspera} espera su turno</Text>
      </View>

      <View style={styles.capaExplosion} pointerEvents="none">
        <Animated.View
          style={[styles.anillo, { opacity: opacidadAnillo, transform: [{ scale: escalaAnillo }] }]}
        />
        <Animated.Text
          style={[styles.textoExplosion, { opacity: opacidadExplosion, transform: [{ scale: escalaExplosion }] }]}
        >
          💥
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  capaExplosion: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anillo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FF6B35',
  },
  textoExplosion: {
    fontSize: 110,
  },
  container: {
    flex: 1,
    backgroundColor: '#12141C',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  filaVidas: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  tarjetaVidas: {
    flex: 1,
    backgroundColor: '#1E212E',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#3A3F55',
  },
  tarjetaVidasActiva: {
    borderColor: '#FF6B35',
  },
  nombreVidas: {
    color: '#F4F1EA',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  vidas: {
    color: '#E63946',
    fontSize: 15,
  },
  filaSuperior: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  turnoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTexto: {
    color: '#12141C',
    fontSize: 12,
    fontWeight: '700',
  },
  turnoTexto: {
    color: '#F4F1EA',
    fontSize: 13,
    fontWeight: '600',
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  casillaBomba: {
    backgroundColor: '#E63946',
    borderWidth: 0,
  },
  casillaAcierto: {
    backgroundColor: '#2EC4B6',
    borderWidth: 0,
  },
  iconoBomba: {
    color: '#FBDFDF',
    fontSize: 24,
  },
  iconoAcierto: {
    color: '#DFF3E3',
    fontSize: 24,
  },
  ayuda: {
    color: '#6B6B6B',
    fontSize: 12,
    textAlign: 'center',
  },
  esperaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  esperaTexto: {
    color: '#F4F1EA',
    fontSize: 12,
  },
});