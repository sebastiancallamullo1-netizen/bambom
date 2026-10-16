import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cargarPerfil, guardarPerfil, registrarPartida, registrarBombas, cargarPatrones } from './storage';

const GameContext = createContext(null);

const crearTableroVacio = () =>
  Array(9).fill(null).map(() => ({ bomba: false, revelada: false }));

function elegirPorPatrones(disponibles, patrones) {
  const minimo = Math.min(...disponibles.map((i) => patrones[i]));
  const menosUsadas = disponibles.filter((i) => patrones[i] === minimo);
  return menosUsadas[Math.floor(Math.random() * menosUsadas.length)];
}

function obtenerAdyacentes(indice) {
  const fila = Math.floor(indice / 3);
  const col = indice % 3;
  const adyacentes = [];
  for (const [df, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    const f = fila + df;
    const c = col + dc;
    if (f >= 0 && f < 3 && c >= 0 && c < 3) adyacentes.push(f * 3 + c);
  }
  return adyacentes;
}

export function GameProvider({ children }) {
  const [nombreJ1, setNombreJ1] = useState('Jugador 1');
  const [nombreJ2, setNombreJ2] = useState('Sebas');

  const [tableroJ1, setTableroJ1] = useState(crearTableroVacio());
  const [tableroJ2, setTableroJ2] = useState(crearTableroVacio());

  const [vidasJ1, setVidasJ1] = useState(3);
  const [vidasJ2, setVidasJ2] = useState(3);

  const [turno, setTurno] = useState(() => (Math.random() < 0.5 ? 'J1' : 'J2'));
  const [ganador, setGanador] = useState(null);

  const [modoJuego, setModoJuego] = useState('2jugadores');
  const [dificultadCPU, setDificultadCPU] = useState('facil');
  const impactosCPU = useRef([]);
  const partidaGuardada = useRef(false);
  const patronesRef = useRef(Array(9).fill(0));

  useEffect(() => {
    cargarPerfil().then((perfil) => {
      if (perfil && perfil.nombre) setNombreJ1(perfil.nombre);
    });
    cargarPatrones().then((patrones) => {
      patronesRef.current = patrones;
    });
  }, []);

  useEffect(() => {
    if (!ganador || partidaGuardada.current) return;
    partidaGuardada.current = true;
    const bombasJ1 = tableroJ1.map((c, i) => (c.bomba ? i : -1)).filter((i) => i >= 0);
    (async () => {
      await registrarPartida({
        fecha: new Date().toISOString(),
        modo: modoJuego,
        dificultad: modoJuego === 'cpu' ? dificultadCPU : null,
        jugador: nombreJ1,
        rival: nombreJ2,
        gano: ganador === 'J1',
        vidasRestantes: ganador === 'J1' ? vidasJ1 : vidasJ2,
      });
      await registrarBombas(bombasJ1);
      patronesRef.current = await cargarPatrones();
    })();
  }, [ganador]);

  function guardarNombre(nombre) {
    setNombreJ1(nombre);
    guardarPerfil({ nombre });
  }

  function reiniciarJuego() {
    setTableroJ1(crearTableroVacio());
    setTableroJ2(crearTableroVacio());
    setVidasJ1(3);
    setVidasJ2(3);
    setTurno(Math.random() < 0.5 ? 'J1' : 'J2');
    setGanador(null);
    impactosCPU.current = [];
    partidaGuardada.current = false;
  }

  function alternarBomba(jugador, indice) {
    const tablero = jugador === 'J1' ? tableroJ1 : tableroJ2;
    const setTablero = jugador === 'J1' ? setTableroJ1 : setTableroJ2;

    const bombasColocadas = tablero.filter((c) => c.bomba).length;
    const casilla = tablero[indice];

    if (!casilla.bomba && bombasColocadas >= 3) return;

    const nuevoTablero = tablero.map((c, i) =>
      i === indice ? { ...c, bomba: !c.bomba } : c
    );
    setTablero(nuevoTablero);
  }

  function colocarBombasAleatorias(jugador) {
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const elegidos = indices.slice(0, 3);
    const nuevoTablero = crearTableroVacio().map((c, i) =>
      elegidos.includes(i) ? { ...c, bomba: true } : c
    );
    if (jugador === 'J1') setTableroJ1(nuevoTablero);
    else setTableroJ2(nuevoTablero);
  }

  function atacarCasilla(indice) {
    if (ganador) return;

    const esAtacanteJ1 = turno === 'J1';
    const tableroRival = esAtacanteJ1 ? tableroJ2 : tableroJ1;
    const setTableroRival = esAtacanteJ1 ? setTableroJ2 : setTableroJ1;

    const casilla = tableroRival[indice];
    if (casilla.revelada) return;

    const nuevoTablero = tableroRival.map((c, i) =>
      i === indice ? { ...c, revelada: true } : c
    );
    setTableroRival(nuevoTablero);

    if (casilla.bomba) {
      if (esAtacanteJ1) {
        const vidasRestantes = vidasJ1 - 1;
        setVidasJ1(vidasRestantes);
        if (vidasRestantes <= 0) setGanador('J2');
      } else {
        const vidasRestantes = vidasJ2 - 1;
        setVidasJ2(vidasRestantes);
        if (vidasRestantes <= 0) setGanador('J1');
      }
    }

    setTurno(esAtacanteJ1 ? 'J2' : 'J1');
  }

  function elegirCasillaCPU(tableroObjetivo) {
    const disponibles = tableroObjetivo
      .map((c, i) => i)
      .filter((i) => !tableroObjetivo[i].revelada);

    if (disponibles.length === 0) return null;

    if (dificultadCPU === 'dificil') {
      return elegirPorPatrones(disponibles, patronesRef.current);
    }

    if (dificultadCPU === 'medio') {
      for (const indiceBomba of impactosCPU.current) {
        const candidatos = obtenerAdyacentes(indiceBomba).filter((i) =>
          disponibles.includes(i)
        );
        if (candidatos.length > 0) {
          return candidatos[Math.floor(Math.random() * candidatos.length)];
        }
      }
    }

    return disponibles[Math.floor(Math.random() * disponibles.length)];
  }

  function jugarTurnoCPU() {
    if (turno !== 'J2' || ganador || modoJuego !== 'cpu') return;
    const indice = elegirCasillaCPU(tableroJ1);
    if (indice === null) return;
    if (tableroJ1[indice].bomba) {
      impactosCPU.current.push(indice);
    }
    atacarCasilla(indice);
  }

  const valor = {
    nombreJ1, nombreJ2, setNombreJ1, setNombreJ2, guardarNombre,
    tableroJ1, tableroJ2,
    vidasJ1, vidasJ2,
    turno, ganador,
    modoJuego, setModoJuego,
    dificultadCPU, setDificultadCPU,
    reiniciarJuego, alternarBomba, atacarCasilla,
    colocarBombasAleatorias, jugarTurnoCPU,
  };

  return <GameContext.Provider value={valor}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}