import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { cargarHistorial } from '../storage';
import { colors } from '../theme';

function formatearFecha(iso) {
  const d = new Date(iso);
  const dos = (n) => String(n).padStart(2, '0');
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()} ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

function textoModo(partida) {
  if (partida.modo === 'cpu') {
    const niveles = { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' };
    const nivel = niveles[partida.dificultad] || '';
    return `vs CPU ${nivel}`.trim();
  }
  return '2 jugadores';
}

export default function HistorialScreen({ navigation }) {
  const [partidas, setPartidas] = useState([]);

useEffect(() => {
  const actualizarHistorial = () => {
    cargarHistorial().then(setPartidas);
  };

  actualizarHistorial();

  const suscripcion = navigation.addListener(
    'focus',
    actualizarHistorial
  );

  return suscripcion;
}, [navigation]);

  function renderPartida({ item }) {
    const color = item.gano ? colors.exito : colors.peligro;
    return (
      <View style={[styles.fila, { borderLeftColor: color }]}>
        <View style={styles.filaTexto}>
          <Text style={styles.rival}>
            {item.jugador} vs {item.rival}
          </Text>
          <Text style={styles.detalle}>
            {textoModo(item)} · {formatearFecha(item.fecha)}
          </Text>
        </View>
        <View style={styles.filaResultado}>
          <Text style={[styles.resultado, { color }]}>{item.gano ? 'VICTORIA' : 'DERROTA'}</Text>
          <Text style={styles.detalle}>{item.vidasRestantes} vida(s) restante(s)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>HISTORIAL</Text>

      {partidas.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.textoVacio}>Todavía no jugaste ninguna partida.</Text>
        </View>
      ) : (
        <FlatList
          style={styles.lista}
          data={partidas}
          keyExtractor={(item, index) => `${item.fecha}-${index}`}
          renderItem={renderPartida}
        />
      )}

      <TouchableOpacity style={styles.botonPrimario} onPress={() => navigation.goBack()}>
        <Text style={styles.textoPrimario}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  titulo: {
    color: colors.texto,
    fontSize: 13,
    letterSpacing: 3,
    fontWeight: '600',
    marginBottom: 24,
  },
  lista: {
    width: '100%',
    flex: 1,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderLeftWidth: 5,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  filaTexto: {
    flex: 1,
    paddingRight: 8,
  },
  filaResultado: {
    alignItems: 'flex-end',
  },
  rival: {
    color: colors.texto,
    fontSize: 14,
    fontWeight: '700',
  },
  detalle: {
    color: colors.textoSuave,
    fontSize: 11,
    marginTop: 2,
  },
  resultado: {
    fontSize: 13,
    fontWeight: '800',
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
  },
  textoVacio: {
    color: colors.textoSuave,
    fontSize: 14,
  },
  botonPrimario: {
    backgroundColor: colors.secundario,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginTop: 12,
    marginBottom: 12,
  },
  textoPrimario: {
    color: '#412402',
    fontSize: 14,
    fontWeight: '700',
  },
});
