            
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