import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import UserDetailsPage from "./pages/UserDetailsPage";
import UsersListPage from "./pages/UsersListPage";
import Header from "./components/Header";
import { store } from "./store/store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<UsersListPage />} />
            <Route path="/users/:id" element={<UserDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
