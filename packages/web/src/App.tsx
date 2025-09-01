import AppRouter from "./router";
import { useThemeEffect } from "./feature/theme/useThemeEffect";

function App() {
  // Apply the theme
  useThemeEffect();
  
  return <AppRouter />;
}

export default App;
