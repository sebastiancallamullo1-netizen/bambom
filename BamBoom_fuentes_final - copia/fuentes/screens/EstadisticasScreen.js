
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useGame } from '../juegocontext';
import { cargarStats, borrarDatos, STATS_INICIALES } from '../storage';
import { colors } from '../theme';

function Tarjeta({ valor, etiqueta, color }) {
  return (
    <View style={styles.tarjeta}>
      <Text style={[styles.valor, { color }]}>{valor}</Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

export default function EstadisticasScreen({ navigation }) {
  const { nombreJ1, nombreJ2 } = useGame();

  const [jugadorSeleccionado, setJugadorSeleccionado] = useState('J1');
  const [stats, setStats] = useState(STATS_INICIALES);

  const nombreActual =
    jugadorSeleccionado === 'J1' ? nombreJ1 : nombreJ2;

  useEffect(() => {
    const actualizarStats = () => {
      cargarStats(nombreActual).then(setStats);
    };

    actualizarStats();

    const suscripcion = navigation.addListener(
      'focus',
      actualizarStats
    );

    return suscripcion;
  }, [navigation, nombreActual]);
    

  const total = stats.victorias + stats.derrotas;

  const porcentaje =
    total === 0
      ? 0
      : Math.round((stats.victorias / total) * 100);

  function confirmarBorrado() {
    Alert.alert(
      'Borrar datos',
      'Se borrarán las estadísticas y el historial. ¿Seguro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await borrarDatos();
            setStats(STATS_INICIALES);
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>ESTADÍSTICAS</Text>

      <View style={styles.selector}>
        <TouchableOpacity
          style={[
            styles.botonJugador,
            jugadorSeleccionado === 'J1' && styles.jugadorActivo,
          ]}
          onPress={() => setJugadorSeleccionado('J1')}
        >
          <Text style={styles.textoJugador}>{nombreJ1}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botonJugador,
            jugadorSeleccionado === 'J2' && styles.jugadorActivo,
          ]}
          onPress={() => setJugadorSeleccionado('J2')}
        >
          <Text style={styles.textoJugador}>{nombreJ2}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.jugador}>{nombreActual}</Text>

      <View style={styles.grilla}>
        <Tarjeta
          valor={total}
          etiqueta="Partidas"
          color={colors.texto}
        />

        <Tarjeta
          valor={`${porcentaje}%`}
          etiqueta="Efectividad"
          color={colors.secundario}
        />

        <Tarjeta
          valor={stats.victorias}
          etiqueta="Victorias"
          color={colors.exito}
        />

        <Tarjeta
          valor={stats.derrotas}
          etiqueta="Derrotas"
          color={colors.peligro}
        />

        <Tarjeta
          valor={stats.racha}
          etiqueta="Racha actual"
          color={colors.primario}
        />

        <Tarjeta
          valor={stats.mejorRacha}
          etiqueta="Mejor racha"
          color={colors.primario}
        />
      </View>

      <TouchableOpacity
        style={styles.botonPrimario}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoPrimario}>Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonBorrar}
        onPress={confirmarBorrado}
      >
        <Text style={styles.textoBorrar}>Borrar datos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    color: colors.texto,
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: '600',
  },
  jugador: {
    color: colors.primario,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 20,
  },
  selector: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 20,
  },
  botonJugador: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: 10,
    backgroundColor: colors.tarjeta,
  },
  jugadorActivo: {
    borderColor: colors.primario,
    borderWidth: 2,
  },
  textoJugador: {
    color: colors.texto,
    fontWeight: '700',
    textAlign: 'center',
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  tarjeta: {
    width: '48%',
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  valor: {
    fontSize: 28,
    fontWeight: '800',
  },
  etiqueta: {
    color: colors.textoSuave,
    fontSize: 12,
    marginTop: 4,
  },
  botonPrimario: {
    backgroundColor: colors.secundario,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginTop: 8,
  },
  textoPrimario: {
    color: '#412402',
    fontSize: 14,
    fontWeight: '700',
  },
  botonBorrar: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  textoBorrar: {
    color: colors.peligro,
    fontSize: 13,
    fontWeight: '600',
  },
});
