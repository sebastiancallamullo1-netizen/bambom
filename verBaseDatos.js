import * as SQLite from 'expo-sqlite';

// Nombre del archivo de la base de datos. Debe ser el mismo que usa storage.js
// en openDatabaseAsync(...). Si no coincide, el visor mostrará la base vacía.
const NOMBRE_BD = 'bamboom.db';

// Cantidad máxima de filas que se muestran por tabla (las más recientes primero).
const MAX_FILAS = 100;

// Abre la base, lee todas sus tablas y devuelve un resumen: versión de SQLite,
// y por cada tabla su nombre, el comando CREATE TABLE con que se creó,
// la cantidad total de filas y las últimas filas.
// No depende de cómo esté armada la base: descubre las tablas en sqlite_master.
export async function leerBase() {
  const db = await SQLite.openDatabaseAsync(NOMBRE_BD);
  try {
    const version = await db.getFirstAsync('SELECT sqlite_version() AS version');
    const tablas = await db.getAllAsync(
      "SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );

    const resultado = [];
    for (const tabla of tablas) {
      const conteo = await db.getFirstAsync(`SELECT COUNT(*) AS total FROM "${tabla.name}"`);
      let filas;
      try {
        filas = await db.getAllAsync(
          `SELECT * FROM "${tabla.name}" ORDER BY rowid DESC LIMIT ${MAX_FILAS}`
        );
      } catch (e) {
        filas = await db.getAllAsync(`SELECT * FROM "${tabla.name}" LIMIT ${MAX_FILAS}`);
      }
      resultado.push({ nombre: tabla.name, esquema: tabla.sql, total: conteo.total, filas });
    }

    return { archivo: NOMBRE_BD, version: version.version, tablas: resultado };
  } finally {
    await db.closeAsync();
  }
}

// Convierte el resumen en texto plano para poder compartirlo (WhatsApp, mail, etc.).
export function textoParaCompartir(datos) {
  const lineas = [`Base de datos ${datos.archivo} (SQLite ${datos.version})`, ''];
  for (const tabla of datos.tablas) {
    lineas.push(`== ${tabla.nombre} (${tabla.total} filas) ==`);
    lineas.push(tabla.esquema);
    for (const fila of tabla.filas) {
      lineas.push(JSON.stringify(fila));
    }
    lineas.push('');
  }
  return lineas.join('\n');
}
