import { Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const MAX_HISTORIAL = 50;

export const STATS_INICIALES = { victorias: 0, derrotas: 0, racha: 0, mejorRacha: 0 };

let basePromesa = null;

function avisarError(donde, e) {
  console.warn('Base de datos - ' + donde, e);
  Alert.alert('Error en la base de datos', donde + ': ' + (e && e.message ? e.message : String(e)));
}

function abrirBase() {
  if (!basePromesa) {
    basePromesa = (async () => {
      try {
        const db = await SQLite.openDatabaseAsync('bamboom.db');
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS perfil (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            nombre TEXT NOT NULL
          );
          CREATE TABLE IF NOT EXISTS partidas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            modo TEXT NOT NULL,
            dificultad TEXT,
            jugador TEXT NOT NULL,
            rival TEXT NOT NULL,
            gano INTEGER NOT NULL,
            vidas_restantes INTEGER NOT NULL
          );
          CREATE TABLE IF NOT EXISTS patrones (
            casilla INTEGER PRIMARY KEY,
            veces INTEGER NOT NULL DEFAULT 0
          );
        `);
        return db;
      } catch (e) {
        basePromesa = null;
        throw e;
      }
    })();
  }
  return basePromesa;
}

export async function cargarPerfil() {
  try {
    const db = await abrirBase();
    const fila = await db.getFirstAsync('SELECT nombre FROM perfil WHERE id = 1');
    return fila ? { nombre: fila.nombre } : null;
  } catch (e) {
    avisarError('cargarPerfil', e);
    return null;
  }
}

export async function guardarPerfil(perfil) {
  try {
    const db = await abrirBase();
    await db.runAsync(
      'INSERT INTO perfil (id, nombre) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET nombre = excluded.nombre',
      [perfil.nombre]
    );
  } catch (e) {
    avisarError('guardarPerfil', e);
  }
}



export async function cargarHistorial() {
  try {
    const db = await abrirBase();
    const filas = await db.getAllAsync(
      'SELECT fecha, modo, dificultad, jugador, rival, gano, vidas_restantes FROM partidas ORDER BY id DESC LIMIT ?',
      [MAX_HISTORIAL]
    );
    return filas.map((fila) => ({
      fecha: fila.fecha,
      modo: fila.modo,
      dificultad: fila.dificultad,
      jugador: fila.jugador,
      rival: fila.rival,
      gano: fila.gano === 1,
      vidasRestantes: fila.vidas_restantes,
    }));
  } catch (e) {
    avisarError('cargarHistorial', e);
    return [];
  }
}

export async function registrarPartida(partida) {
  try {
    const db = await abrirBase();
    await db.runAsync(
      'INSERT INTO partidas (fecha, modo, dificultad, jugador, rival, gano, vidas_restantes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        partida.fecha,
        partida.modo,
        partida.dificultad,
        partida.jugador,
        partida.rival,
        partida.gano ? 1 : 0,
        partida.vidasRestantes,
      ]
    );
  } catch (e) {
    avisarError('registrarPartida', e);
  }
}

export async function registrarBombas(indices) {
  try {
    const db = await abrirBase();
    for (const casilla of indices) {
      await db.runAsync(
        'INSERT INTO patrones (casilla, veces) VALUES (?, 1) ON CONFLICT(casilla) DO UPDATE SET veces = veces + 1',
        [casilla]
      );
    }
  } catch (e) {
    avisarError('registrarBombas', e);
  }
}

export async function cargarPatrones() {
  const patrones = Array(9).fill(0);
  try {
    const db = await abrirBase();
    const filas = await db.getAllAsync('SELECT casilla, veces FROM patrones');
    for (const fila of filas) {
      patrones[fila.casilla] = fila.veces;
    }
  } catch (e) {
    avisarError('cargarPatrones', e);
  }
  return patrones;
}

export async function borrarDatos() {
  try {
    const db = await abrirBase();
    await db.runAsync('DELETE FROM partidas');
  } catch (e) {
    avisarError('borrarDatos', e);
  }
}

export async function verDatosGuardados() {
  try {
    const db = await abrirBase();

    const perfil = await db.getAllAsync(
      'SELECT * FROM perfil'
    );

    const partidas = await db.getAllAsync(
      'SELECT * FROM partidas ORDER BY id DESC'
    );

    const patrones = await db.getAllAsync(
      'SELECT * FROM patrones ORDER BY casilla'
    );

    console.log('PERFIL:', perfil);
    console.log('PARTIDAS:', partidas);
    console.log('PATRONES:', patrones);
  } catch (e) {
    console.error('Error al consultar la base de datos:', e);
  }
}


export async function cargarStats(nombreJugador) {
  try {
    const db = await abrirBase();

    const partidas = await db.getAllAsync(
      `SELECT gano
       FROM partidas
       WHERE jugador = ?
       ORDER BY id ASC`,
      [nombreJugador]
    );

    let victorias = 0;
    let derrotas = 0;
    let racha = 0;
    let mejorRacha = 0;

    for (let i = 0; i < partidas.length; i++) {
      if (partidas[i].gano === 1) {
        victorias++;
        racha++;

        if (racha > mejorRacha) {
          mejorRacha = racha;
        }
      } else {
        derrotas++;
        racha = 0;
      }
    }

    return {
      victorias: victorias,
      derrotas: derrotas,
      racha: racha,
      mejorRacha: mejorRacha
    };
  } catch (e) {
    avisarError('Cargar estadísticas', e);
    return { ...STATS_INICIALES };
  }
}
