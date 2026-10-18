import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { leerBase, textoParaCompartir } from '../verBaseDatos';

// Dibuja una tabla de la base: nombre, cantidad de filas, cómo se creó y sus filas.
function Tabla({ tabla }) {
  const recortada = tabla.total > tabla.filas.length;

  return (
    <View style={styles.bloque}>
      <Text style={styles.nombreTabla}>{tabla.nombre}</Text>
      <Text style={styles.cantidad}>
        {tabla.total} fila(s){recortada ? ` · se muestran las últimas ${tabla.filas.length}` : ''}
      </Text>
      <Text style={styles.esquema}>{tabla.esquema}</Text>

      {tabla.filas.length === 0 ? (
        <Text style={styles.vacia}>Tabla vacía</Text>
      ) : (
        tabla.filas.map((fila, indice) => (
          <View key={indice} style={styles.fila}>
            {Object.keys(fila).map((columna) => (
              <View key={columna} style={styles.celda}>
                <Text style={styles.columna}>{columna}</Text>
                <Text style={styles.valor}>
                  {fila[columna] === null ? 'NULL' : String(fila[columna])}
                </Text>
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );
}

// Pantalla que permite ver el contenido real de la base de datos SQLite.
export default function BaseDatosScreen({ navigation }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  const actualizar = useCallback(() => {
    setError(null);
    leerBase()
      .then(setDatos)
      .catch((e) => setError(e && e.message ? e.message : String(e)));
  }, []);

  useEffect(() => {
    actualizar();
  }, [actualizar]);

  function compartir() {
    if (datos) {
      Share.share({ message: textoParaCompartir(datos) });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>BASE DE DATOS</Text>

      {error ? (
        <View style={styles.centro}>
          <Text style={styles.textoError}>No se pudo leer la base:</Text>
          <Text style={styles.textoError}>{error}</Text>
        </View>
      ) : datos === null ? (
        <View style={styles.centro}>
          <Text style={styles.vacia}>Cargando...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.subtitulo}>
            SQLite {datos.version} · archivo {datos.archivo}
          </Text>
          <ScrollView style={styles.lista}>
            {datos.tablas.length === 0 ? (
              <Text style={styles.vacia}>
                No hay tablas. Revisá que el nombre del archivo sea el mismo que usa storage.js.
              </Text>
            ) : (
              datos.tablas.map((tabla) => <Tabla key={tabla.nombre} tabla={tabla} />)
            )}
          </ScrollView>
        </>
      )}

      <View style={styles.filaBotones}>
        <TouchableOpacity style={styles.botonSecundario} onPress={actualizar}>
          <Text style={styles.textoSecundario}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonSecundario} onPress={compartir}>
          <Text style={styles.textoSecundario}>Compartir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonPrimario} onPress={() => navigation.goBack()}>
          <Text style={styles.textoPrimario}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12141C', alignItems: 'center', padding: 24, paddingTop: 60 },
  titulo: { color: '#FFFFFF', fontSize: 13, letterSpacing: 3, fontWeight: '600' },
  subtitulo: { color: '#FF6B35', fontSize: 12, fontWeight: '700', marginTop: 6, marginBottom: 16 },
  lista: { width: '100%', flex: 1 },
  centro: { flex: 1, justifyContent: 'center', paddingHorizontal: 12 },
  bloque: { marginBottom: 22 },
  nombreTabla: { color: '#F2A93B', fontSize: 16, fontWeight: '800' },
  cantidad: { color: '#9AA0B4', fontSize: 11, marginTop: 2, marginBottom: 6 },
  esquema: { color: '#9AA0B4', fontSize: 10, marginBottom: 8, fontFamily: 'monospace' },
  vacia: { color: '#9AA0B4', fontSize: 13 },
  textoError: { color: '#E63946', fontSize: 13, textAlign: 'center', marginBottom: 6 },
  fila: { backgroundColor: '#1C1F2B', borderWidth: 1, borderColor: '#3A3F55', borderRadius: 10, padding: 10, marginBottom: 8 },
  celda: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  columna: { color: '#9AA0B4', fontSize: 12 },
  valor: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', flexShrink: 1, textAlign: 'right', marginLeft: 12 },
  filaBotones: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 12 },
  botonPrimario: { backgroundColor: '#F2A93B', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 26 },
  textoPrimario: { color: '#412402', fontSize: 14, fontWeight: '700' },
  botonSecundario: { borderWidth: 1, borderColor: '#3A3F55', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16 },
  textoSecundario: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
});
