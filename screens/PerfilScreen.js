import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useGame } from '../juegocontext';
import { colors } from '../theme';

export default function PerfilScreen({ navigation }) {
  const { nombreJ1, guardarNombre } = useGame();
  const [nombre, setNombre] = useState(nombreJ1);

  function guardar() {
    const limpio = nombre.trim();
    if (limpio.length === 0) {
      Alert.alert('Falta el nombre', 'Escribí un nombre para tu perfil.');
      return;
    }
    guardarNombre(limpio);
    navigation.goBack();
  }

  const inicial = nombre.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>PERFIL DE JUGADOR</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>{inicial}</Text>
      </View>

      <Text style={styles.etiqueta}>Tu nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Escribí tu nombre"
        placeholderTextColor={colors.textoSuave}
        maxLength={12}
      />
      <Text style={styles.ayuda}>Hasta 12 caracteres. Se guarda en el celular.</Text>

      <TouchableOpacity style={styles.botonPrimario} onPress={guardar}>
        <Text style={styles.textoPrimario}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.goBack()}>
        <Text style={styles.textoSecundario}>Omitir</Text>
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
    marginBottom: 32,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primario,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  avatarTexto: {
    color: colors.fondo,
    fontSize: 36,
    fontWeight: '800',
  },
  etiqueta: {
    color: colors.textoSuave,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    backgroundColor: colors.tarjeta,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: 10,
    color: colors.texto,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  ayuda: {
    color: colors.textoSuave,
    fontSize: 11,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 28,
  },
  botonPrimario: {
    backgroundColor: colors.secundario,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginBottom: 12,
  },
  textoPrimario: {
    color: '#412402',
    fontSize: 14,
    fontWeight: '700',
  },
  botonSecundario: {
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  textoSecundario: {
    color: colors.textoSuave,
    fontSize: 14,
    fontWeight: '600',
  },
});
