import React from "react";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SetlistProvider } from "./contexts/SetlistContext.jsx";
import Header from "./components/Header.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SetlistSearch from "./components/SetlistSearch.jsx";
import SetlistDisplay from "./components/SetlistDisplay.jsx";

function App() {
  return (
    <AuthProvider>
      <SetlistProvider>
        <div className="p-4">
          <Header />
          <LoginForm />
          <section>
            <SetlistSearch />
            <SetlistDisplay />
          </section>
        </div>
      </SetlistProvider>
    </AuthProvider>
  );
}

export default App;
