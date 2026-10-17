import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { GameProvider } from './juegocontext';
import SeleccionScreen from './screens/SeleccionScreen';
import ColocacionScreen from './screens/ColocacionScreen';
import TableroScreen from './screens/TableroScreen';
import ResultadosScreen from './screens/ResultadosScreen';
import PerfilScreen from './screens/PerfilScreen';
import EstadisticasScreen from './screens/EstadisticasScreen';
import HistorialScreen from './screens/HistorialScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Seleccion" component={SeleccionScreen} />
          <Stack.Screen name="Colocacion" component={ColocacionScreen} />
          <Stack.Screen name="Tablero" component={TableroScreen} />
          <Stack.Screen name="Resultados" component={ResultadosScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="Estadisticas" component={EstadisticasScreen} />
          <Stack.Screen name="Historial" component={HistorialScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}