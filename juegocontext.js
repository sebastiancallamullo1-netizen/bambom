            import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  cargarPerfil, 
  guardarPerfil, 
  registrarPartida, 
  registrarBombas, 
  cargarPatrones,
  cargarStats 
} from './storage';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [nombreJ1, setNombreJ1] = useState('Jugador 1');
  const [nombreJ2, setNombreJ2] = useState('Jugador 2');
  const [tableroJ1, setTableroJ1] = useState([]);
  const [tableroJ2, setTableroJ2] = useState([]);
  const [vidasJ1, setVidasJ1] = useState(3);
  const [vidasJ2, setVidasJ2] = useState(3);
  const [turno, setTurno] = useState('J1');
  const [ganador, setGanador] = useState(null);
  const [modoJuego, setModoJuego] = useState('cpu');
  const [dificultadCPU, setDificultadCPU] = useState('medio');

  const patronesRef = useRef([]);
  const impactosCPU = useRef([]);

  useEffect(() => {
    cargarPatrones().then((p) => {
      patronesRef.current = p;
    });
  }, []);

  useEffect(() => {
    cargarPerfil().then((perfil) => {
      if (perfil && perfil.nombre) {
        setNombreJ1(perfil.nombre);
      }
    });
  }, []);

  function guardarNombre(nuevoNombre) {
    if (nuevoNombre) {
      setNombreJ1(nuevoNombre);
      guardarPerfil({ nombre: nuevoNombre });
    } else {
      guardarPerfil({ nombre: nombreJ1 });
    }
  }

  function reiniciarJuego() {
    setTableroJ1([]);
    setTableroJ2([]);
    setVidasJ1(3);
    setVidasJ2(3);
    setTurno('J1');
    setGanador(null);
    impactosCPU.current = [];
  }

  function alternarBomba(indice, esJ1) {
  }

  function colocarBombasAleatorias(cantidad, esJ1) {
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

  function obtenerAdyacentes(indice) {
    const adyacentes = {
      0: [1, 3],
      1: [0, 2, 4],
      2: [1, 5],
      3: [0, 4, 6],
      4: [1, 3, 5, 7],
      5: [2, 4, 8],
      6: [3, 7],
      7: [4, 6, 8],
      8: [5, 7],
    };
    return adyacentes[indice] || [];
  }

  function elegirPorPatrones(disponibles, patrones) {
    let mejor = disponibles[0];
    let max = -1;
    for (const i of disponibles) {
      if (patrones[i] > max) {
        max = patrones[i];
        mejor = i;
      }
    }
    return mejor;
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

  return (
    <GameContext.Provider value={valor}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}